"""Organize a completed public-media archive without changing original image bytes.
Usage: python3 scripts/organize-public-media.py <recovery-archive>
"""
from pathlib import Path
from urllib.parse import urlparse,unquote
from PIL import Image,ImageOps
import json,re,sys,hashlib,shutil,unicodedata,csv
from wordpress_html import Tree,widgets,norm

archive=Path(sys.argv[1])
def slug(value):return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',value).encode('ascii','ignore').decode().lower()).strip('-')
def family(url):
    value=unquote(urlparse(url).path).split('/uploads/')[-1]
    return re.sub(r'-(scaled|rotated)(?=\.[^.]+$)','',re.sub(r'-\d+x\d+(?=\.[^.]+$)','',value))
raw=json.loads((archive/'pages/api-pages.json').read_text())
roots={p['slug']:Tree(p['content']['rendered']).root for p in raw}
images=lambda node:list(dict.fromkeys(n.attrs['src'] for n in node.all(lambda n:n.tag=='img' and '/wp-content/uploads/' in n.attrs.get('src',''))))
associations={};order=[]
def associate(key,label,urls,kind,category):
    associations[key]={'key':key,'label':label,'sourceImages':urls,'evidence':kind,'category':category,'images':[]}
    order.append(key)
for w in widgets(roots['corpo-clinico']):
    if w.attrs['data-widget_type']=='elementskit-team.default':
        name=norm(w.all(lambda n:n.cls('ekit-team-modal-title'))[0].text())
        associate('team.'+slug(name),name,images(w),'Same named public profile/modal','equipa')
blog_widgets=widgets(roots['blog'])
for i,w in enumerate(blog_widgets):
    heads=w.all(lambda n:re.fullmatch('h[1-6]',n.tag))
    if w.attrs['data-widget_type']=='text-editor.default' and heads:
        title=norm(heads[0].text());previous=next(x for x in reversed(blog_widgets[:i]) if x.attrs['data-widget_type']=='image.default')
        associate('posts.'+slug(title),title,images(previous),'Image immediately preceding the blog entry','blog')
for name in ['unidade-leca-da-palmeira','unidade-sao-mamede-de-infesta']:
    gallery=[w for w in widgets(roots[name]) if w.attrs['data-widget_type']=='image-gallery.default']
    associate('units.'+name.removeprefix('unidade-'),name.replace('-',' '),[url for w in gallery for url in images(w)],'Gallery on the specific unit page','unidades')
service_widgets=widgets(roots['servicos'])
for i,w in enumerate(service_widgets):
    if w.attrs['data-widget_type']=='heading.default' and norm(w.text())!='Serviços':
        title=norm(w.text());previous=next(x for x in reversed(service_widgets[:i]) if x.attrs['data-widget_type']=='image.default')
        associate('services.'+slug(title),title,images(previous),'Image immediately preceding the service heading','servicos')
for name in ['fisioterapia','acupunctura','psicologia','terapia-da-fala','terapia-ocupacional','floortime','integracao-sensorial']:
    associate('serviceGallery.'+('acupuntura' if name=='acupunctura' else name),name.replace('-',' '),images(roots[name]),'Images in the body of the service page','servicos')
associate('clinicGallery','Clínica Alcançari',images(roots['a-clinica']),'Gallery on A Clínica','clinica')
home_widgets=widgets(roots['home'])
# The first actual photograph in the homepage sequence (skip decorative Asset-* PNGs).
home_photos=[url for w in home_widgets if w.attrs['data-widget_type']=='image.default' for url in images(w) if not re.search(r'/Asset-',url)]
associate('home','Imagem da página inicial',home_photos[:1],'First photograph on the original homepage','clinica')
associate('brand','Logótipo Alcançari',['https://alcancari.com/wp-content/uploads/2025/07/logo-alcancar-e1751493490677.png'],'Original header logo','branding')
associate('brandFooter','Logótipo Alcançari — rodapé',['https://alcancari.com/wp-content/uploads/2025/07/logo-alcancar-sem-fundo-2.png'],'Original footer logo','branding')
associate('favicon','Símbolo Alcançari',['https://alcancari.com/wp-content/uploads/2025/07/cropped-logo-alcancar-e1751493490677.png'],'Original public favicon family','branding')

records=json.loads((archive/'downloads.json').read_text())
for g in records:
    g['associations']=[key for key in order if any(family(url)==g['family'] for url in associations[key]['sourceImages'])]
    if g['selected']:
        with Image.open(g['selected']['archivePath']) as im:
            im=ImageOps.exif_transpose(im).convert('RGBA')
            g['pixelSha256']=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()
# Visually verified: this separately uploaded 1536 px image is the same uncropped
# photograph as the public 2048 px original (pixel comparison RMS 0.38/255).
canonical_by_family = {g['family']: g for g in records}
smaller = canonical_by_family.get('2025/07/20210531_Alcancari_TF_048-1536x1024-1.jpg')
larger = canonical_by_family.get('2025/07/20210531_Alcancari_TF_048.jpg')
if smaller and larger and smaller['selected'] and larger['selected']:
    smaller['pixelSha256'] = larger['pixelSha256']
# Deduplicate verified equivalents; retain every source file in archive.
unique={};missing=[]
for g in records:
    if not g['selected']:missing.append(g);continue
    unique.setdefault(g['pixelSha256'],[]).append(g)
entries=[];by_family={}
for number,group in enumerate(unique.values(),1):
    selected=max((g['selected'] for g in group),key=lambda s:(s['width']*s['height'],s['bytes']))
    keys=list(dict.fromkeys(key for g in group for key in g['associations']))
    naming_key=next((key for prefix in ['team.','posts.','units.','services.','serviceGallery.','brand','favicon','home','clinicGallery'] for key in keys if key.startswith(prefix)),None)
    pages=sorted({p for g in group for ref in g['references'] for p in ref['pages']})
    f=group[0]['family'];base=Path(f).stem
    if naming_key:
        association=associations[naming_key];category=association['category'];name=slug(association['label'])
    elif 'logo' in base or base.startswith(('Asset-','08-')):category='branding';name='elemento-grafico-'+slug(base)
    elif any('/blog/' in p for p in pages):category='blog';name='blog-'+slug(base)
    elif any(any('/'+s+'/' in p for s in ['fisioterapia','acupunctura','psicologia','terapia-da-fala','terapia-ocupacional','floortime','integracao-sensorial']) for p in pages):category='servicos';name='imagem-servico-'+slug(base)
    elif any('/unidade-' in p for p in pages):category='unidades';name='unidades-'+slug(base)
    else:category='clinica';name='clinica-'+slug(base)
    extension={'JPEG':'.jpg','PNG':'.png','WEBP':'.webp','AVIF':'.avif','GIF':'.gif'}[selected['format']]
    filename=f'{name[:95]}-{selected["sha256"][:8]}{extension}'
    target=Path('public/images')/category/filename;target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists():assert hashlib.sha256(target.read_bytes()).hexdigest()==selected['sha256'],'Refusing to overwrite a different existing image'
    else:shutil.copyfile(selected['archivePath'],target)
    entry={'id':f'image-{number:03}','category':category,'fileName':filename,'localPath':'/'+str(target.relative_to('public')),'width':selected['width'],'height':selected['height'],'bytes':selected['bytes'],'sha256':selected['sha256'],'sourceUrl':selected['url'],'originalFileName':Path(unquote(urlparse(selected['url']).path)).name,'archivePath':selected['archivePath'],'families':[g['family'] for g in group],'pages':pages,'associations':keys,'lowResolution':min(selected['width'],selected['height'])<600,'sourceReferences':[ref for g in group for ref in g['references']],'retrievedAt':'2026-11-12'}
    entries.append(entry)
    for g in group:by_family[g['family']]=entry
for key,a in associations.items():
    seen=set()
    for url in a['sourceImages']:
        entry=by_family.get(family(url))
        if entry and entry['localPath'] not in seen:
            seen.add(entry['localPath']);a['images'].append({'src':entry['localPath'],'alt':a['label'] if key.startswith('team.') else 'Imagem de '+a['label']+' no website da Clínica Alcançari','width':entry['width'],'height':entry['height']})
    a['status']='recovered' if a['images'] else 'no-public-image' if not a['sourceImages'] else 'unavailable'
    a['localImage']=a['images'][0] if a['images'] else None
media={'brand':associations['brand']['localImage']['src'],'brandFooter':associations['brandFooter']['localImage']['src'],'favicon':associations['favicon']['localImage']['src'],'home':associations['home']['localImage'],'clinic':associations['clinicGallery']['localImage'],'team':{},'services':{},'units':{},'posts':{},'galleries':{'clinic':associations['clinicGallery']['images'],'services':{},'units':{}}}
for key,a in associations.items():
    if '.' not in key:continue
    kind,identifier=key.split('.',1)
    if kind in ['team','services','units','posts']:
        media[kind][identifier]=a['localImage']
        if kind=='units':media['galleries']['units'][identifier]=a['images']
    elif kind=='serviceGallery':media['galleries']['services'][identifier]=a['images']
Path('src/content/media.js').write_text('// Public originals recovered from alcancari.com; provenance in docs/media-inventory.json.\nexport const media = '+json.dumps(media,ensure_ascii=False,indent=2)+'\n')
Path('docs/media-inventory.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
Path('docs/media-assignments.json').write_text(json.dumps(list(associations.values()),ensure_ascii=False,indent=2)+'\n')
# Keep the original reference inventory and resolve each URL to the deduplicated local file.
manifest=json.loads(Path('docs/media-manifest.json').read_text())
known={m['sourceUrl'] for m in manifest}
for g in records:
    for ref in g['references']:
        if ref['url'] not in known:manifest.append({'sourceUrl':ref['url'],'usedOn':ref['pages'],'discoveredIn':ref['discoveredIn']});known.add(ref['url'])
for item in manifest:
    e=by_family.get(family(item['sourceUrl']));item['status']='recovered' if e else 'unavailable';item['localPath']=e['localPath'] if e else None
Path('docs/media-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with Path('docs/media-inventory.csv').open('w',newline='') as out:
    writer=csv.writer(out);writer.writerow(['ficheiro','categoria','largura','altura','bytes','origem','original','arquivo','paginas','sha256','resolucao_limitada'])
    for e in entries:writer.writerow([e['localPath'],e['category'],e['width'],e['height'],e['bytes'],e['sourceUrl'],e['originalFileName'],e['archivePath'],' | '.join(e['pages']),e['sha256'],e['lowResolution']])
summary={'families':len(records),'recoveredFamilies':sum(bool(g['selected']) for g in records),'uniqueImages':len(entries),'duplicatesAvoided':sum(bool(g['selected']) for g in records)-len(entries),'totalBytes':sum(e['bytes'] for e in entries),'lowResolution':[e['localPath'] for e in entries if e['lowResolution']],'missingImages':[g['family'] for g in missing],'missingPortraits':[a['label'] for key,a in associations.items() if key.startswith('team.') and not a['images']]}
(archive/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False,indent=2))
