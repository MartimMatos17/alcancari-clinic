"""Offline import of the public WordPress snapshot. Never connects to WordPress.
Usage: python3 scripts/import-wordpress.py <directory containing api-pages.json>
"""
from pathlib import Path
from urllib.parse import urlparse, unquote
import sys, json, re, hashlib, unicodedata
from wordpress_html import Tree, Node, norm, widgets

snapshot = Path(sys.argv[1])
raw = json.loads((snapshot / 'api-pages.json').read_text())
pages = {p['slug']: p for p in raw}
roots = {k: Tree(p['content']['rendered']).root for k, p in pages.items()}
output = Path('src/content'); docs = Path('docs/sources'); docs.mkdir(parents=True, exist_ok=True)
manifest = []

def slug(text):
    return re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()).strip('-')

def textblocks(node):
    result = []
    pending = []
    def flush():
        chunks = re.split(r'\n\s*\n', ''.join(pending)); pending.clear()
        for chunk in chunks:
            text = norm(chunk)
            if text: result.append({'type': 'paragraph', 'text': text})
    def visit(n):
        if isinstance(n, str): pending.append(n); return
        if n.tag in ['script', 'style', 'svg']: return
        if re.fullmatch('h[1-6]', n.tag):
            flush(); result.append({'type': 'heading', 'level': min(3, max(2, int(n.tag[1]))), 'text': norm(n.text())}); return
        if n.tag in ['ul', 'ol']:
            flush(); result.append({'type': 'list', 'ordered': n.tag == 'ol', 'items': [norm(c.text()) for c in n.all(lambda c:c.tag=='li')]}); return
        if n.tag == 'br': flush(); return
        if n.tag in ['p', 'div']: flush()
        for c in n.children: visit(c)
        if n.tag in ['p', 'div']: flush()
    visit(node); flush()
    return [b for b in result if b.get('text') or b.get('items')]

def blocktext(blocks): return norm(' '.join(' '.join(b['items']) if b['type']=='list' else b['text'] for b in blocks))
def source(key): return {'url': pages[key]['link'], 'retrievedAt': '2026-11-12', 'wordpressId': pages[key]['id']}
def approved(): return {'confirmed': True, 'published': True}
def audit(identifier, original, blocks, url):
    original=norm(original)
    assert original == blocktext(blocks), f'Loss of text: {identifier}'
    manifest.append({'id':identifier, 'url':url, 'textSha256':hashlib.sha256(original.encode()).hexdigest(), 'characters':len(original)})
    (docs / f'{identifier}.txt').write_text(original+'\n')

def pageblocks(key):
    selected=[w for w in widgets(roots[key]) if w.attrs['data-widget_type'] in ['heading.default','text-editor.default','icon-list.default']]
    blocks=[b for w in selected for b in textblocks(w)]
    audit(key, ' '.join(w.text() for w in selected), blocks, pages[key]['link'])
    return blocks

service_widgets=widgets(roots['servicos'])
services=[]
for i,w in enumerate(service_widgets):
    if w.attrs['data-widget_type']!='heading.default' or norm(w.text())=='Serviços': continue
    title=norm(w.text()); key=slug(title); original_key='acupunctura' if key=='acupuntura' else key
    summary=next(norm(x.text()) for x in service_widgets[i+1:] if x.attrs['data-widget_type']=='text-editor.default')
    exists=original_key in pages
    services.append({'slug':key,'title':title,'summary':summary,'blocks':pageblocks(original_key) if exists else [],'status':'complete' if exists else 'summary-only','source':source(original_key if exists else 'servicos'),'image':None,**approved()})
assert len(services)==9

team=[]
for w in widgets(roots['corpo-clinico']):
    if w.attrs['data-widget_type']!='elementskit-team.default': continue
    select=lambda cls:w.all(lambda n:n.cls(cls))[0]
    name=norm(select('ekit-team-modal-title').text()); role=norm(select('ekit-team-modal-position').text())
    biography=select('ekit-team-modal-content'); blocks=textblocks(biography); identifier=slug(name)
    audit(identifier,biography.text(),blocks,pages['corpo-clinico']['link'])
    team.append({'id':identifier,'name':name,'role':role,'blocks':blocks,'source':source('corpo-clinico'),'image':None,**approved()})
assert len(team)==16

posts=[]
for w in widgets(roots['blog']):
    if w.attrs['data-widget_type']!='text-editor.default': continue
    headings=w.all(lambda n:re.fullmatch('h[1-6]',n.tag))
    if not headings: continue
    title=norm(headings[0].text()); blocks=textblocks(w); heading_index=next(i for i,b in enumerate(blocks) if b['type']=='heading')
    category=blocktext(blocks[:heading_index]); body=blocks[heading_index+1:]; key=slug(title)
    audit(key,w.text(),blocks,pages['blog']['link'])
    posts.append({'slug':key,'title':title,'category':category,'summary':blocktext(body),'blocks':body,'date':None,'author':None,'status':'excerpt-only','source':source('blog'),'image':None,**approved()})
assert len(posts)==12

home=[w for w in widgets(roots['home']) if w.attrs['data-widget_type']=='text-editor.default']
intro=next(norm(w.text()) for w in home if norm(w.text()).startswith('É um espaço'))
about=next(textblocks(w) for w in home if norm(w.text()).startswith('A Alcançari tem'))
# Some Elementor versions split the two presentation paragraphs into separate widgets.
if not any('O objetivo da intervenção' in b.get('text','') for b in about):
    about+=next(textblocks(w) for w in home if norm(w.text()).startswith('O objetivo da intervenção'))
clinic={'intro':intro,'blocks':about,'practicalBlocks':pageblocks('a-clinica'),'source':source('home')}
audit('apresentacao', intro+' '+blocktext(about), [{'type':'paragraph','text':intro}]+about,pages['home']['link'])
units=[]
for key in ['unidade-leca-da-palmeira','unidade-sao-mamede-de-infesta']:
    root=roots[key]; blocks=pageblocks(key)
    addresses=root.all(lambda n:n.tag=='a' and n.attrs.get('href','').startswith('https://share.google'))
    address=norm(addresses[0].text()); match=re.search(r'\d{4}-\d{3}',address)
    units.append({'id':key.removeprefix('unidade-'),'name':pages[key]['title']['rendered'],'address':address[:match.start()].strip(' ,'),'postalCode':address[match.start():],'mapUrl':addresses[0].attrs['href'],'hours':[b['text'] for b in blocks if b['type']=='paragraph'],'blocks':blocks,'source':source(key),'image':None,**approved()})

# Every referenced WordPress image, including srcset and gallery/background URLs.
media={}
for key,p in pages.items():
    html=p['content']['rendered']
    urls=set(re.findall(r'https://alcancari.com/wp-content/uploads/[^\s"<>]+?\.(?:png|jpe?g|webp|svg|gif|avif)',html,re.I))
    for url in sorted(urls):
        relative=unquote(urlparse(url).path).split('/uploads/',1)[1]
        if url not in media: media[url]={'sourceUrl':url,'wordpressPath':relative,'suggestedLocalPath':'/images/wordpress/'+relative,'usedOn':[],'status':'awaiting-export'}
        media[url]['usedOn'].append(key)

# Include original header/footer logos when the full homepage snapshot exists.
if (snapshot / 'home.html').exists():
    homepage = Tree((snapshot / 'home.html').read_text()).root
    for image in homepage.all(lambda n:n.tag == 'img' and 'logo-alcancar' in n.attrs.get('src', '')):
        url = image.attrs['src']
        if url not in media:
            relative = unquote(urlparse(url).path).split('/uploads/', 1)[1]
            media[url] = {'sourceUrl': url, 'wordpressPath': relative, 'suggestedLocalPath': '/images/wordpress/' + relative, 'usedOn': ['header/footer'], 'status': 'awaiting-export'}

for filename,data in [('services.json',services),('team.json',team),('posts.json',posts),('clinic.json',clinic),('units.json',units)]:
    (output/filename).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(docs/'manifest.json').write_text(json.dumps({'retrievedAt':'2026-11-12','entries':manifest,'htmlHashes':{p['slug']:hashlib.sha256(p['content']['rendered'].encode()).hexdigest() for p in raw}},ensure_ascii=False,indent=2)+'\n')
media_path = Path('docs/media-manifest.json')
# Preserve recovery status, local mappings and CSS-only references on later text imports.
previous = {item['sourceUrl']: item for item in json.loads(media_path.read_text())} if media_path.exists() else {}
for url, item in media.items():
    previous[url] = {**item, **previous.get(url, {})}
media_path.write_text(json.dumps(list(previous.values()),ensure_ascii=False,indent=2)+'\n')
print(f'Importados: {len(services)} serviços, {len(team)} profissionais, {len(posts)} excertos, {len(units)} unidades; {len(manifest)} verificações integrais; {len(media)} referências de imagens.')
