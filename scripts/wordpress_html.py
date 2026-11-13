from html.parser import HTMLParser
import re
class Node:
 def __init__(self,tag='',attrs=(),parent=None): self.tag=tag; self.attrs=dict(attrs); self.children=[]; self.parent=parent
 def all(self,predicate):
  out=[]
  for c in self.children:
   if isinstance(c,Node):
    if predicate(c): out.append(c)
    out.extend(c.all(predicate))
  return out
 def cls(self,c): return c in self.attrs.get('class','').split()
 def text(self):
  if self.tag in ['script','style','svg']: return ''
  return ''.join(c if isinstance(c,str) else ('\n' if c.tag=='br' else c.text()+('\n' if c.tag in ['p','li','div','h1','h2','h3','h4','h5','h6'] else '')) for c in self.children)
class Tree(HTMLParser):
 def __init__(self,html):
  super().__init__(convert_charrefs=True); self.root=Node(); self.current=self.root; self.feed(html)
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs,self.current); self.current.children.append(n)
  if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']: self.current=n
 def handle_endtag(self,tag):
  n=self.current
  while n.parent:
   if n.tag==tag: self.current=n.parent; break
   n=n.parent
 def handle_data(self,data): self.current.children.append(data)
def norm(s): return re.sub(r'\s+',' ',s).strip()
def widgets(root): return root.all(lambda n:bool(n.attrs.get('data-widget_type')))
