import math, random, json, glob, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
OUT='/home/claude/mangala/assets/'
def font(names,size):
    for n in names:
        for p in glob.glob('/usr/share/fonts/truetype/**/'+n,recursive=True):
            return ImageFont.truetype(p,size)
    return ImageFont.load_default()
SERIF=['PlayfairDisplay-Bold*.ttf','DejaVuSerif-Bold.ttf']
SANS=['Poppins-Medium.ttf','Poppins-Regular.ttf','DejaVuSans.ttf']
def hx(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def grad(W,H,c1,c2):
    t=np.linspace(0,1,H)[:,None,None]; a=np.array(hx(c1))[None,None,:]; b=np.array(hx(c2))[None,None,:]
    arr=(a*(1-t)+b*t)*np.ones((1,W,1)); return Image.fromarray(arr.astype('uint8'),'RGB').convert('RGBA')
def petals(d,cx,cy,n,dist,L,w,fill,line,rot=0,span=360,start=0):
    for i in range(n):
        a=math.radians(start+rot+(span*i/n if span==360 else span*i/max(n-1,1)))
        px,py=cx+dist*math.cos(a),cy+dist*math.sin(a)
        pts=[]
        for k in range(36):
            t=2*math.pi*k/36; x=L*math.cos(t)*(1 if math.cos(t)>0 else .55); y=w*math.sin(t)
            pts.append((px+x*math.cos(a)-y*math.sin(a),py+x*math.sin(a)+y*math.cos(a)))
        d.polygon(pts,fill=fill,outline=line)
def ring(d,cx,cy,r,col,w=4): d.ellipse([cx-r,cy-r,cx+r,cy+r],outline=col,width=w)
def dot(d,cx,cy,r,col): d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=col)
def star(d,cx,cy,R,r,n,fill):
    pts=[(cx+(R if i%2==0 else r)*math.cos(math.pi*i/n-math.pi/2),cy+(R if i%2==0 else r)*math.sin(math.pi*i/n-math.pi/2)) for i in range(2*n)]
    d.polygon(pts,fill=fill)
def motif(d,m,cx,cy,A,bg,al):
    f=A+(55,); s=A+(255,)
    if m=='mandala':
        for j,(n,dist,L,w) in enumerate([(16,250,110,34),(12,170,100,38),(8,95,80,36)]):
            petals(d,cx,cy,n,dist,L,w,f,s,rot=j*11)
        ring(d,cx,cy,330,s,5);ring(d,cx,cy,345,s,2);dot(d,cx,cy,34,s)
    elif m=='peacock':
        petals(d,cx,cy+120,13,230,120,34,f,s,span=170,start=185)
        for i in range(13):
            a=math.radians(185+170*i/12);dot(d,cx+330*math.cos(a),cy+120+330*math.sin(a),20,s)
        d.ellipse([cx-60,cy+60,cx+60,cy+260],fill=s)
    elif m=='kolam':
        for r in range(-3,4):
            for c in range(-3,4):
                if abs(r)+abs(c)<=3: dot(d,cx+c*80,cy+r*80,8,s)
        for k in range(1,4):
            d.polygon([(cx,cy-k*80),(cx+k*80,cy),(cx,cy+k*80),(cx-k*80,cy)],outline=s,fill=f if k==2 else None,width=3)
        ring(d,cx,cy,330,s,3)
    elif m=='lotus':
        for j,(n,L,w,dist) in enumerate([(9,200,50,220),(7,160,44,160),(5,120,38,100)]):
            petals(d,cx,cy+230,n,dist,L,w,f,s,span=150 if j==0 else 120,start=195 if j==0 else 210)
    elif m=='arch':
        d.rounded_rectangle([cx-250,cy-300,cx+250,cy+330],radius=250,outline=s,width=6)
        d.rounded_rectangle([cx-215,cy-265,cx+215,cy+330],radius=215,outline=s,width=2)
        d.line([cx,cy-150,cx,cy+150],fill=s,width=10);d.line([cx-70,cy-50,cx+70,cy-50],fill=s,width=10)
        for k in range(12):
            a=math.radians(180+15*k);d.line([cx+90*math.cos(a),cy-150+90*math.sin(a),cx+170*math.cos(a),cy-150+170*math.sin(a)],fill=s,width=3)
    elif m=='gopuram':
        for k in range(6):
            w=300-k*45;y=cy+300-k*95
            d.polygon([(cx-w,y),(cx+w,y),(cx+w-30,y-85),(cx-w+30,y-85)],fill=f,outline=s)
            for q in range(-3,4):
                if abs(q*w/3.5)<w-40: d.rectangle([cx+q*w/3.5-9,y-62,cx+q*w/3.5+9,y-18],outline=s)
        d.ellipse([cx-16,cy-300,cx+16,cy-268],fill=s);d.line([cx,cy-268,cx,cy-250],fill=s,width=6)
    elif m=='crescent':
        star(d,cx,cy,330,260,8,f);star(d,cx,cy,250,200,8,s)
        d.ellipse([cx-150,cy-150,cx+150,cy+150],fill=s);d.ellipse([cx-90,cy-175,cx+190,cy+125],fill=bg+(255,))
        star(d,cx+70,cy-20,38,16,5,s)
    elif m=='rose':
        for j,(n,dist,L,w) in enumerate([(10,190,150,60),(8,120,110,50),(6,60,70,36)]):
            petals(d,cx,cy,n,dist,L,w,f,s,rot=j*20)
        dot(d,cx,cy,20,s)
    elif m=='minimal':
        for k,r in enumerate([320,270,220]): d.arc([cx-r,cy-r+60,cx+r,cy+r+60],180,360,fill=s,width=4-k)
        d.line([cx-320,cy+60,cx+320,cy+60],fill=s,width=3);dot(d,cx,cy-130,16,s)
    elif m=='jasmine':
        rnd=random.Random(7)
        for _ in range(26):
            x,y=cx+rnd.randint(-330,330),cy+rnd.randint(-270,300);petals(d,x,y,5,22,24,14,(255,255,255,235),A+(255,),rot=rnd.randint(0,70));dot(d,x,y,6,A+(255,))
        d.arc([cx-300,cy-250,cx+300,cy+330],200,340,fill=s,width=4)
    elif m=='sun':
        for k in range(17):
            a=math.radians(180+180*k/16);d.line([cx+150*math.cos(a),cy+60+150*math.sin(a),cx+340*math.cos(a),cy+60+340*math.sin(a)],fill=s,width=6)
        d.pieslice([cx-140,cy-80,cx+140,cy+200],180,360,fill=s);d.line([cx-340,cy+60,cx+340,cy+60],fill=s,width=4)
def card(c,W=1200,H=1680):
    im=grad(W,H,*c['bg']);L=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(L)
    A=hx(c['accent']);s=A+(255,)
    d.rectangle([50,50,W-50,H-50],outline=s,width=6);d.rectangle([80,80,W-80,H-80],outline=s,width=2)
    for x,y in [(80,80),(W-80,80),(80,H-80),(W-80,H-80)]:
        dot(d,x,y,16,s);ring(d,x,y,30,s,2)
    motif(d,c['motif'],W//2,560,A,hx(c['bg'][0]),255)
    tc=hx(c['text']);F=font(SANS,34);d.text((W//2,1010),'—  WEDDING INVITATION  —',font=F,fill=tc+(255,),anchor='mm')
    d.text((W//2,1130),c['n1'],font=font(SERIF,100),fill=tc+(255,),anchor='mm')
    d.text((W//2,1235),'&',font=font(SERIF,70),fill=s,anchor='mm')
    d.text((W//2,1340),c['n2'],font=font(SERIF,100),fill=tc+(255,),anchor='mm')
    d.line([W//2-200,1430,W//2+200,1430],fill=s,width=3)
    d.text((W//2,1490),c['date'],font=font(SANS,44),fill=tc+(255,),anchor='mm')
    d.text((W//2,1560),c['place'],font=font(SANS,32),fill=tc+(220,),anchor='mm')
    im.alpha_composite(L);return im.convert('RGB').resize((600,840),Image.LANCZOS)
C=[
('Kalyana Mandala','Traditional','mandala',('#5a0f1e','#2e0610'),'#e2b659','#fbe8c0','Arjun','Meera','14 · 02 · 2027','Madurai',18,'Bold maroon base with a hand-drawn golden mandala','Playfair + Noto Sans Tamil','South Indian Hindu weddings'),
('Mayil Peacock Royal','Royal','peacock',('#0b4a4f','#06292c'),'#e7c15f','#fdf0cf','Karthik','Divya','05 · 03 · 2027','Chennai',28,'Teal and gold peacock fan, inspired by temple silks','Playfair + Poppins','Grand receptions, royal themes'),
('Kolam Mangalam','Traditional','kolam',('#fff4dc','#f4dca8'),'#a31621','#5a0f1e','Siva','Lakshmi','21 · 04 · 2027','Coimbatore',14,'Cream paper with a red pulli-kolam diamond','Playfair + Poppins','Muhurtham & simple Tamil weddings'),
('Thamarai Lotus','Floral','lotus',('#fde4ea','#f6bccb'),'#b3305a','#6b1c35','Vignesh','Priya','10 · 05 · 2027','Trichy',16,'Soft blush gradient with layered lotus petals','Playfair + Poppins','Garden and morning weddings'),
('Madurai Meenakshi','Royal','gopuram',('#7a1020','#3b0710'),'#f0c36a','#ffeccb','Surya','Ananya','26 · 06 · 2027','Madurai',32,'Temple gopuram arch with rays in antique gold','Playfair + Noto Sans Tamil','Temple weddings, grand families'),
('Rose Garden','Floral','rose',('#fff0ee','#f9cfc8'),'#c4485a','#7a2332','Rahul','Nisha','12 · 07 · 2027','Bengaluru',15,'Layered roses on a peach blush backdrop','Playfair + Poppins','Garden receptions, engagements'),
('Chapel Grace','Christian','arch',('#f4f1e8','#d9dfe8'),'#203a63','#1b2d4d','Daniel','Grace','19 · 08 · 2027','Nagercoil',17,'Ivory and navy chapel window with a cross','Playfair + Poppins','Church weddings'),
('Nikah Noor','Muslim','crescent',('#0d4d3b','#062b21'),'#e3c067','#fff3d1','Imran','Ayesha','23 · 09 · 2027','Hyderabad',22,'Emerald night with a gold crescent and 8-point star','Playfair + Poppins','Nikah and walima'),
('Minimal Arch','Modern','minimal',('#eef1ea','#cfd8c8'),'#4c6b50','#2f4a33','Aarav','Kavya','02 · 10 · 2027','Pondicherry',12,'Sage green, clean lines, lots of whitespace','Poppins + Playfair','Modern couples, small gatherings'),
('Midnight Gold','Modern','minimal',('#16161d','#0a0a0e'),'#d6b25e','#f3e6c2','Nikhil','Sneha','15 · 11 · 2027','Mumbai',25,'Black foil look with thin gold arcs','Playfair + Poppins','Evening receptions'),
('Mullai Jasmine','Floral','jasmine',('#f3f8ec','#d3e5c4'),'#4f7a3a','#2f4b22','Gokul','Mythili','27 · 11 · 2027','Thanjavur',13,'Scattered jasmine blooms on soft green','Playfair + Poppins','Traditional yet fresh look'),
('Sunrise Sangamam','Modern','sun',('#ff9e5e','#d9435a'),'#fff1cf','#fff7e6','Dev','Ishita','08 · 12 · 2027','Goa',19,'Warm sunrise gradient with golden rays','Poppins + Playfair','Beach & destination weddings'),
]
data=[]
for i,c in enumerate(C,1):
    k=dict(name=c[0],cat=c[1],motif=c[2],bg=c[3],accent=c[4],text=c[5],n1=c[6],n2=c[7],date=c[8],place=c[9])
    fn=f'card{i:02d}.png';card(k).save(OUT+'cards/'+fn,optimize=True)
    data.append(dict(id=i,name=c[0],cat=c[1],img=fn,price=c[10],digital=499+ (i%4)*100,rating=round(4.3+(i%7)/10,1),sold=120+i*37,
      palette=[c[3][0],c[3][1],c[4],c[5]],style=c[11],fonts=c[12],ideal=c[13],motif=c[2],
      paper=['Matte 300 GSM','Textured Cotton','Gold Foil Emboss','Laser Cut'][i%4]))
open(OUT+'js/data.js','w').write('const PRODUCTS='+json.dumps(data,ensure_ascii=False)+';\n')
# logo / mandala / avatars / pattern / icons
def transparent_mandala(sz,col,fn):
    L=Image.new('RGBA',(sz*2,sz*2),(0,0,0,0));d=ImageDraw.Draw(L);c=sz
    for j,(n,dist,l,w) in enumerate([(24,.78,.2,.07),(16,.55,.2,.09),(12,.32,.16,.08)]):
        petals(d,c,c,n,dist*sz,l*sz,w*sz,col+(40,),col+(255,),rot=j*7)
    for r in (.97,.93,.2,.1): ring(d,c,c,r*sz,col+(255,),4)
    L.resize((sz,sz),Image.LANCZOS).save(fn)
transparent_mandala(800,(226,182,89),OUT+'img/mandala-gold.png')
transparent_mandala(800,(255,255,255),OUT+'img/mandala-white.png')
lg=Image.new('RGBA',(800,800),(0,0,0,0));d=ImageDraw.Draw(lg);d.ellipse([20,20,780,780],fill=(90,15,30,255),outline=(226,182,89,255),width=12)
petals(d,400,400,12,200,130,48,(226,182,89,70),(226,182,89,255));petals(d,400,400,8,100,90,40,(226,182,89,140),(255,236,190,255))
dot(d,400,400,34,(255,236,190,255));lg.resize((200,200),Image.LANCZOS).save(OUT+'img/logo.png')
for i,(n,col) in enumerate([('RK','#b3305a'),('SM','#0b4a4f'),('AJ','#7a1020'),('FN','#4c6b50')],1):
    a=Image.new('RGBA',(400,400),(0,0,0,0));d=ImageDraw.Draw(a);d.ellipse([0,0,399,399],fill=hx(col)+(255,))
    d.text((200,200),n,font=font(SERIF,150),fill=(255,240,210,255),anchor='mm');a.resize((120,120),Image.LANCZOS).save(OUT+f'img/avatar{i}.png')
p=Image.new('RGBA',(120,120),(255,248,236,255));d=ImageDraw.Draw(p);petals(d,60,60,8,22,22,9,(201,162,75,60),(201,162,75,160));dot(d,60,60,4,(201,162,75,255));
for x,y in [(0,0),(120,0),(0,120),(120,120)]: dot(d,x,y,6,(201,162,75,200))
p.save(OUT+'img/pattern.png')
icons={'design':'lotus','print':'rose','delivery':'arrow','call':'phone'}
for k in icons:
    a=Image.new('RGBA',(400,400),(0,0,0,0));d=ImageDraw.Draw(a);d.ellipse([10,10,390,390],fill=(90,15,30,255),outline=(226,182,89,255),width=10)
    g=(226,182,89,255)
    if k=='design': petals(d,200,260,7,60,80,26,g[:3]+(90,),g,span=140,start=200)
    elif k=='print': d.rounded_rectangle([110,120,290,280],14,outline=g,width=10);d.rectangle([140,200,260,300],fill=(90,15,30,255),outline=g,width=8);d.line([140,240,260,240],fill=g,width=6)
    elif k=='delivery': d.rectangle([90,150,230,250],outline=g,width=10);d.polygon([(230,180),(290,180),(320,220),(320,250),(230,250)],outline=g,width=10);dot(d,140,270,22,g);dot(d,280,270,22,g)
    else: d.arc([110,110,290,290],200,340,fill=g,width=18);d.rounded_rectangle([105,190,160,260],12,fill=g);d.rounded_rectangle([240,190,295,260],12,fill=g)
    a.resize((128,128),Image.LANCZOS).save(OUT+f'img/icon-{k}.png')
fl=Image.new('RGBA',(1000,160),(0,0,0,0));d=ImageDraw.Draw(fl);d.line([60,80,440,80],fill=(201,162,75,255),width=3);d.line([560,80,940,80],fill=(201,162,75,255),width=3)
petals(d,500,80,8,38,38,14,(201,162,75,90),(201,162,75,255));dot(d,500,80,10,(201,162,75,255));fl.save(OUT+'img/divider.png')
# hero video
W,H,N=960,540,144
bgc=grad(W,H,'#3a0612','#7a1a2c').convert('RGB')
rnd=random.Random(3);P=[(rnd.randint(0,W),rnd.randint(0,H),rnd.randint(4,16),rnd.choice([1,1,2]),rnd.random()*6.28) for _ in range(46)]
man=Image.open(OUT+'img/mandala-gold.png').resize((900,900))
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','24','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','30','-movflags','+faststart','-an',OUT+'video/hero.mp4'],stdin=subprocess.PIPE)
for f in range(N):
    t=f/N;fr=bgc.convert('RGBA')
    m=man.rotate(-30*t,resample=Image.BICUBIC);m.putalpha(m.getchannel('A').point(lambda v:int(v*.28)));fr.alpha_composite(m,(W//2-450,H//2-450))
    g=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(g)
    for x,y,r,k,ph in P:
        yy=(y-t*H*k)%H;xx=x+22*math.sin(2*math.pi*t+ph);al=int(120+80*math.sin(2*math.pi*t*2+ph))
        dot(d,xx,yy,r,(255,214,120,al))
    fr.alpha_composite(g.filter(ImageFilter.GaussianBlur(3)));ff.stdin.write(fr.convert('RGB').tobytes())
ff.stdin.close();ff.wait()
bgc.convert('RGB').save(OUT+'img/hero-poster.png')
print('done')
