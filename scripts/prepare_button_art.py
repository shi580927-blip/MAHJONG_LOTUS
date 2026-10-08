"""Pack three generated alpha button skins, ordered top-to-bottom."""
import argparse, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects
parser=argparse.ArgumentParser()
parser.add_argument('source',type=Path)
args=parser.parse_args()
im=Image.open(args.source).convert('RGBA')
components,_=label(np.asarray(im)[:,:,3]>128)
boxes=[(r[1].start,r[0].start,r[1].stop,r[0].stop) for r in find_objects(components) if(r[1].stop-r[1].start)*(r[0].stop-r[0].start)>20000]
boxes.sort(key=lambda b:b[1])
assert len(boxes)==3, f'Expected three skins, found {len(boxes)}'
w,h,pad=560,100,8
atlas=Image.new('RGBA',(w+pad*2,(h+pad*2)*3),(0,0,0,0))
frames={}
for i,(name,box) in enumerate(zip(['primary','secondary','disabled'],boxes)):
    skin=im.crop(box).resize((w,h),Image.Resampling.LANCZOS)
    x,y=pad,i*(h+pad*2)+pad
    atlas.paste(skin,(x,y))
    frames[name]={'frame':{'x':x,'y':y,'w':w,'h':h},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':w,'h':h},'sourceSize':{'w':w,'h':h}}
out=Path('assets/runtime/atlases/review_buttons');out.mkdir(parents=True,exist_ok=True)
atlas.save(out/'review_buttons.webp',lossless=True,method=6)
(out/'review_buttons.json').write_text(json.dumps({'frames':frames,'meta':{'image':'review_buttons.webp','size':{'w':atlas.width,'h':atlas.height},'scale':'1'}},indent=2))
print(f'Packed three alpha skins: {atlas.width}x{atlas.height}')
