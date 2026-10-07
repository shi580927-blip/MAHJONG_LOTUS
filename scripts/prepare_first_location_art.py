"""Prepare alpha sprites and orientation-specific review backgrounds; no painted edits."""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT.parent/'generated_images'
def pack(filename, names, cols, cw, ch, dirname):
 image=Image.open(SRC/filename).convert('RGBA')
 labels,_=ndimage.label(np.array(image)[:,:,3]>128)
 bounds=[]
 for i,sl in enumerate(ndimage.find_objects(labels),1):
  if sl is not None and (labels[sl]==i).sum()>30000:
   bounds.append((sl[1].start,sl[0].start,sl[1].stop,sl[0].stop))
 bounds.sort(key=lambda b:(int((b[1]+b[3])/2/(image.height/(len(names)//cols))),b[0]))
 assert len(bounds)==len(names),(filename,len(bounds))
 atlas=Image.new('RGBA',(cols*cw,(len(names)//cols)*ch))
 frames={}
 for i,(name,b) in enumerate(zip(names,bounds)):
  # Original alpha retained; transparent frame padding prevents atlas bleed.
  sprite=ImageOps.contain(image.crop(b),(cw-16,ch-16),Image.Resampling.LANCZOS)
  x=(i%cols)*cw+8; y=(i//cols)*ch+8
  tile=Image.new('RGBA',(cw-16,ch-16))
  tile.alpha_composite(sprite,((cw-16-sprite.width)//2,(ch-16-sprite.height)//2))
  atlas.alpha_composite(tile,(x,y))
  frames[name]={'frame':{'x':x,'y':y,'w':cw-16,'h':ch-16},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':cw-16,'h':ch-16},'sourceSize':{'w':cw-16,'h':ch-16}}
 out=ROOT/'assets/runtime/atlases'/dirname;out.mkdir(parents=True,exist_ok=True)
 atlas.save(out/(dirname+'.webp'),'WEBP',quality=90,method=6)
 (out/(dirname+'.json')).write_text(json.dumps({'frames':frames,'meta':{'image':dirname+'.webp','size':{'w':atlas.width,'h':atlas.height},'scale':'1'}},indent=2))
pack('exec-f7d11b6b-2ee6-4f20-a129-9d52480bf6bd.png',[f'tile_{i:02}' for i in range(12)],4,208,256,'review_tiles')
pack('exec-0bfed9fb-aa67-4bd7-8f28-be5c241a36b2.png',['hint','shuffle','blessing','settings','back','next'],3,144,144,'review_ui')
for src,name,size in [('exec-6092435c-e0eb-412b-bce5-fa03f6ea65e1.png','map_landscape.webp',(1920,1080)),('exec-31b7a02d-ad86-4fd7-a057-c76706007ac9.png','map_portrait.webp',(1080,1920))]:
 im=Image.open(SRC/src).convert('RGB').resize(size,Image.Resampling.LANCZOS)
 im.save(ROOT/'assets/runtime/backgrounds/sections/01'/name,'WEBP',quality=78,method=6)
