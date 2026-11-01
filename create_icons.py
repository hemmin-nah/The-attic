from PIL import Image, ImageDraw
from pathlib import Path
root=Path(__file__).parent/'assets'
im=Image.new('RGB',(64,64),'#0e1728')
d=ImageDraw.Draw(im)
d.rectangle((0,0,63,63), fill='#0e1728')
d.rectangle((6,7,57,57),fill='#27354d')
d.rectangle((10,10,53,53),fill='#be9882')
d.rectangle((14,14,49,48),fill='#223d57')
# dusk gradient pixel bands
for y in range(14,49,5):
 colors=['#344a73','#3f567e','#526386','#6d6b8c','#9a7b94','#c18c98','#dda48f']
 d.rectangle((14,y,49,min(48,y+4)),fill=colors[min((y-14)//5,6)])
d.rectangle((36,20,42,25),fill='#ffdba6')
d.rectangle((34,21,44,24),fill='#ffdba6')
for x,y,w in [(15,31,9),(23,34,8),(31,27,7),(37,36,6),(43,32,7)]:
 d.rectangle((x,y,x+w-1,48),fill='#263549')
 for xx in range(x+2,x+w-1,4):
  for yy in range(y+3,46,6):
   d.rectangle((xx,yy,xx+1,yy+2),fill='#d4ae8e')
d.rectangle((30,14,33,48),fill='#caa38c')
d.rectangle((14,30,49,33),fill='#caa38c')
d.rectangle((10,49,53,53),fill='#644c58')
d.rectangle((2,56,61,61), fill='#8f6572')
# cat silhouette on the sill
c='#1c2539'
d.rectangle((17,44,28,52),fill=c)
d.rectangle((18,40,26,46),fill=c)
d.rectangle((18,37,20,41),fill=c)
d.rectangle((24,37,26,41),fill=c)
d.rectangle((28,47,32,49),fill=c)
d.rectangle((30,44,33,48),fill=c)
d.rectangle((21,43,21,43),fill='#eed9bc')
d.rectangle((25,43,25,43),fill='#eed9bc')
# sparkle top left
d.rectangle((20,18,20,23),fill='#ffe3ae')
d.rectangle((18,20,22,20),fill='#ffe3ae')
for n in [180,192,512]:
 im.resize((n,n),Image.Resampling.NEAREST).save(root/f'icon-{n}.png')
