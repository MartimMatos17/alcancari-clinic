"""Recover only publicly referenced alcancari.com images. GET only, no credentials.
Requires Python/Pillow and curl. Outputs to a recovery archive before installation.
Usage: python3 scripts/recover-public-media.py discover|download <archive-directory>
"""
from pathlib import Path
from urllib.parse import urlparse, urljoin, unquote, quote
from concurrent.futures import ThreadPoolExecutor
from html import unescape
import json, re, hashlib, subprocess, sys
from PIL import Image
from wordpress_html import Tree

BASE = 'https://alcancari.com/'
ARCHIVE = Path(sys.argv[2])
LOG = []

def fetch(url, destination):
    parsed = urlparse(url)
    assert parsed.scheme == 'https' and parsed.netloc == 'alcancari.com'
    destination.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(['curl', '--silent', '--show-error', '--location', '--proto', '=https', '--proto-redir', '=https', '--max-time', '45', '--retry', '1', '-A', 'Mozilla/5.0', '--output', str(destination), '--write-out', '%{http_code}', url], capture_output=True, text=True)
    status = int(result.stdout) if result.stdout.isdigit() else 0
    record = {'url': url, 'httpStatus': status, 'archivePath': str(destination), 'error': result.stderr.strip() if result.returncode else None}
    LOG.append(record)
    return record

def family(url):
    path = unquote(urlparse(url).path).split('/uploads/')[-1]
    path = re.sub(r'-\d+x\d+(?=\.[^.]+$)', '', path)
    return re.sub(r'-(scaled|rotated)(?=\.[^.]+$)', '', path)

def image_urls(text, base):
    text = unescape(text).replace('\\/', '/')
    urls = set(re.findall(r'https://alcancari.com/wp-content/uploads/[^\s"<>\)]+?\.(?:png|jpe?g|webp|svg|gif|avif)(?:\?[^\s"<>\)]*)?', text, re.I))
    for match in re.finditer(r'url\(\s*[\'"]?([^\)\'"\s]+)', text):
        url = urljoin(base, match[1])
        if url.startswith(BASE + 'wp-content/uploads/') and re.search(r'\.(png|jpe?g|webp|svg|gif|avif)(?:\?|$)', url, re.I): urls.add(url)
    return urls

def discover():
    pages = json.loads((ARCHIVE / 'pages/api-pages.json').read_text())
    jobs = [(p['link'], ARCHIVE / 'pages' / (p['slug'] + '.html')) for p in pages]
    with ThreadPoolExecutor(max_workers=4) as pool: list(pool.map(lambda job:fetch(*job), jobs))
    refs = {}; css_pages = {}; ids = set()
    def add(url, page, mechanism):
        refs.setdefault(url, {'url':url,'pages':[], 'discoveredIn':[]})
        if page not in refs[url]['pages']: refs[url]['pages'].append(page)
        if mechanism not in refs[url]['discoveredIn']: refs[url]['discoveredIn'].append(mechanism)
    for page in pages:
        html = (ARCHIVE/'pages'/(page['slug']+'.html')).read_text(errors='replace')
        body = page['content']['rendered']
        for url in image_urls(html+'\n'+body, page['link']): add(url,page['link'],'HTML/srcset/inline-style')
        ids.update(int(n) for n in re.findall(r'wp-image-(\d+)', html+body))
        # Gallery attachment IDs, when exposed in the public markup.
        ids.update(int(n) for n in re.findall(r'attachment_(\d+)',html))
        root = Tree(html).root
        for link in root.all(lambda n:n.tag=='link' and 'stylesheet' in n.attrs.get('rel','')):
            url = urljoin(page['link'],link.attrs.get('href',''))
            if urlparse(url).netloc=='alcancari.com': css_pages.setdefault(url,set()).add(page['link'])
    visited = set()
    while set(css_pages)-visited:
        batch = sorted(set(css_pages)-visited)
        with ThreadPoolExecutor(max_workers=4) as pool:
            results=list(pool.map(lambda url:fetch(url,ARCHIVE/'css'/(hashlib.sha256(url.encode()).hexdigest()[:16]+'.css')),batch))
        for result in results:
            url=result['url'];visited.add(url)
            if result['httpStatus']!=200: continue
            css=Path(result['archivePath']).read_text(errors='replace')
            for image in image_urls(css,url):
                for page in css_pages[url]:add(image,page,url)
            for imported in re.findall(r'@import\s+(?:url\()?\s*[\'"]([^\'"\)]+)',css):
                target=urljoin(url,imported)
                if urlparse(target).netloc=='alcancari.com':css_pages.setdefault(target,set()).update(css_pages[url])
    metadata=[]
    ordered=sorted(ids)
    for i in range(0,len(ordered),50):
        url=BASE+'wp-json/wp/v2/media?per_page=100&include='+','.join(map(str,ordered[i:i+50]))+'&_fields=id,source_url,media_details,alt_text,title'
        path=ARCHIVE/'metadata'/f'media-{i//50+1}.json'
        result=fetch(url,path)
        if result['httpStatus']==200:
            payload=json.loads(path.read_text())
            if isinstance(payload,list):metadata.extend(payload)
    groups={}
    for url,ref in refs.items():
        key=family(url)
        g=groups.setdefault(key,{'family':key,'references':[],'candidates':{},'metadataIds':[]})
        g['references'].append(ref)
        dimension=re.search(r'-(\d+)x(\d+)(?=\.[^.]+$)',urlparse(url).path)
        area=int(dimension[1])*int(dimension[2]) if dimension else 0
        g['candidates'][url]={'url':url,'priority':area,'reason':'public-reference'}
    for item in metadata:
        url=item['source_url']; key=family(url)
        if key not in groups:continue
        g=groups[key];g['metadataIds'].append(item['id']);g['alt']=item.get('alt_text','')
        details=item.get('media_details',{})
        g['candidates'][url]={'url':url,'priority':details.get('width',0)*details.get('height',0),'reason':'public-media-metadata'}
        if details.get('original_image'):
            original=urljoin(url,quote(details['original_image']))
            g['candidates'][original]={'url':original,'priority':10**12,'reason':'original_image-public-metadata'}
        for size in details.get('sizes',{}).values():
            if size.get('source_url'):
                variant=size['source_url'];g['candidates'][variant]={'url':variant,'priority':size.get('width',0)*size.get('height',0),'reason':'public-media-metadata'}
    for key,g in groups.items():
        # A standard WordPress derivative may expose an original at this public URL.
        original=BASE+'wp-content/uploads/'+quote(key)
        if original not in g['candidates']:g['candidates'][original]={'url':original,'priority':10**11,'reason':'public-original-path-candidate'}
        elif not re.search(r'-\d+x\d+\.',original):g['candidates'][original]['priority']=max(g['candidates'][original]['priority'],10**11)
        g['candidates']=sorted(g['candidates'].values(),key=lambda c:c['priority'],reverse=True)
    (ARCHIVE/'discovery.json').write_text(json.dumps({'pages':[p['link'] for p in pages],'cssFiles':sorted(css_pages),'groups':list(groups.values()),'requests':LOG},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'pages':len(pages),'cssFiles':len(css_pages),'imageReferences':len(refs),'families':len(groups),'mediaMetadata':len(metadata),'failedRequests':[r for r in LOG if r['httpStatus']!=200]},ensure_ascii=False),flush=True)

def download():
    discovery=json.loads((ARCHIVE/'discovery.json').read_text())
    def recover(g):
        attempts=[];valid=[]
        # Check the original and largest referenced/metadata alternative; fall back
        # through the remaining public versions only if those cannot be decoded.
        candidates=g['candidates']
        top_reference=next((c for c in candidates if c['priority']<10**11),None)
        primary=[c for c in candidates if c['priority']>=10**11]
        if top_reference and top_reference not in primary:primary.append(top_reference)
        queue=primary+[c for c in candidates if c not in primary]
        for i,c in enumerate(queue):
            if i>=len(primary) and valid:break
            url=c['url'];relative=unquote(urlparse(url).path).split('/uploads/')[1]
            assert '..' not in Path(relative).parts
            path=ARCHIVE/'originals'/relative
            result=fetch(url,path);result['reason']=c['reason']
            if result['httpStatus']==200:
                try:
                    with Image.open(path) as image:
                        image.verify()
                    with Image.open(path) as image:
                        width,height=image.size;fmt=image.format
                    result.update(width=width,height=height,format=fmt,bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest())
                    valid.append(result)
                except Exception as exc:result['decodeError']=str(exc)
            attempts.append(result)
        best=max(valid,key=lambda r:(r['width']*r['height'],r['bytes'])) if valid else None
        print(('OK '+str(best['width'])+'x'+str(best['height']) if best else 'MISSING')+' '+g['family'],flush=True)
        return {**g,'selected':best,'attempts':attempts}
    with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(recover,discovery['groups']))
    (ARCHIVE/'downloads.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'recoveredFamilies':sum(bool(g['selected']) for g in results),'uniqueFiles':len({g['selected']['sha256'] for g in results if g['selected']}),'missing':[g['family'] for g in results if not g['selected']]}),flush=True)

if __name__=='__main__':
    {'discover':discover,'download':download}[sys.argv[1]]()
