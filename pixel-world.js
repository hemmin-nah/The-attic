/* The Attic — original pixel illustrations drawn locally, no external images or libraries. */
(() => {
'use strict';
const THEMES = {
  manhattan:{name:'Manhattan, 1994',place:'Lluvia sobre los tejados',wall:'#38435b',wallLight:'#47516b',floor:'#644b52',floorLine:'#9a6b62',wood:'#9a6d63',woodDark:'#503944',frame:'#b28e7c',light:'#ffd69c',rug:'#9a686d',rug2:'#c68c81',out:'#1b2639'},
  kyoto:{name:'Kyoto de primavera',place:'Cerezos en flor',wall:'#607b72',wallLight:'#73918a',floor:'#a59572',floorLine:'#dbc7a0',wood:'#8c6650',woodDark:'#57483e',frame:'#d6b896',light:'#ffeab4',rug:'#a88485',rug2:'#dfb1a3',out:'#243a38'},
  igloo:{name:'Iglú bajo la aurora',place:'El cielo del norte',wall:'#7199ad',wallLight:'#8bb6c7',floor:'#96bfd0',floorLine:'#d6f4f6',wood:'#7795a8',woodDark:'#355b75',frame:'#def5f2',light:'#f8e5ad',rug:'#637d9d',rug2:'#a9d0e1',out:'#1e4359'},
  forest:{name:'Cabaña entre pinos',place:'Donde empieza el bosque',wall:'#685747',wallLight:'#7c6850',floor:'#79583c',floorLine:'#b58d5a',wood:'#aa8458',woodDark:'#40382e',frame:'#dfbc83',light:'#ffdfa1',rug:'#748369',rug2:'#afba83',out:'#282c27'},
  observatory:{name:'Observatorio nocturno',place:'Un millón de estrellas',wall:'#3c375b',wallLight:'#534968',floor:'#5b4c70',floorLine:'#8b709b',wood:'#8d7798',woodDark:'#342a4c',frame:'#c5a3c5',light:'#fff0c4',rug:'#6876a4',rug2:'#b09ac3',out:'#201d36'}
};
const PETS = {cat:'Gato',dog:'Perro',penguin:'Pingüino',fox:'Zorro',rabbit:'Conejo',crow:'Cuervo'};
function R(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function P(c,pts,color){c.fillStyle=color;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();}
function L(c,x1,y1,x2,y2,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1+.5,y1+.5);c.lineTo(x2+.5,y2+.5);c.stroke();}
function hash(a){let x=Math.sin(a*127.1+4.07)*43758.5453;return x-Math.floor(x);}
function star(c,x,y,clr,r=1){R(c,x-r,y,2*r+1,1,clr);R(c,x,y-r,1,2*r+1,clr);}
function sky(c,theme,time,w,h){
  const sets={
   day:{manhattan:['#85b3c9','#d4b4a8'],kyoto:['#a6d6ca','#f6e0ba'],igloo:['#6dacc9','#c8eef1'],forest:['#8fb6a1','#f3c6a0'],observatory:['#b1a1cd','#f2bcce']},
   dusk:{manhattan:['#596b9a','#f1aa8d'],kyoto:['#8d91b0','#ebaca6'],igloo:['#566f9d','#b1d1d6'],forest:['#665a80','#e3ad7f'],observatory:['#5e4c8f','#d995af']},
   night:{manhattan:['#14253f','#657398'],kyoto:['#203d59','#7f8095'],igloo:['#0c3151','#47758e'],forest:['#1b3037','#687361'],observatory:['#141d46','#514e8e']}
  };
  const [top,bottom]=sets[time][theme];
  const hex=n=>parseInt(n,16), rgb=s=>[hex(s.slice(1,3)),hex(s.slice(3,5)),hex(s.slice(5,7))];
  const a=rgb(top),b=rgb(bottom);
  for(let y=0;y<h;y+=5){let t=Math.min(1,y/(h*.84)), cl='#'+a.map((v,i)=>Math.round(v+(b[i]-v)*t).toString(16).padStart(2,'0')).join(''); R(c,0,y,w,5,cl);}
  if(time==='night'||time==='dusk'){
   for(let i=0;i<57;i++){
     let x=Math.floor(hash(i+12)*w),y=Math.floor(hash(i+117)*h*.69);
     R(c,x,y,i%13===0?2:1,i%13===0?2:1,time==='night'?'#d8e5e7':'#fbe5d0');
   }
  }
  if(time!=='night'){
   let x=theme==='manhattan'?192:theme==='kyoto'?166:52, y=time==='day'?45:100;
   R(c,x-12,y-12,24,24,time==='day'?'#fff3c1':'#ffbe94');
   R(c,x-8,y-16,16,32,time==='day'?'#fff3c1':'#ffbe94');
   R(c,x-16,y-8,32,16,time==='day'?'#fff3c1':'#ffbe94');
  }else if(theme!=='observatory'){
   R(c,179,34,18,18,'#f6e8c8');R(c,186,29,11,18,'#f6e8c8');R(c,185,43,10,8,'#f6e8c8');
  }
}
function mountain(c,base,color,peakx,peaky,amp=65){P(c,[[0,base],[peakx-amp,base],[peakx,peaky],[peakx+amp,base],[240,base]],color);}
function pine(c,x,y,s=1,color='#27473e'){
 let W=16*s,H=47*s;
 R(c,x-2*s,y+29*s,4*s,19*s,'#463c3b');
 P(c,[[x,y],[x-W*.48,y+24*s],[x+W*.48,y+24*s]],color);
 P(c,[[x,y+13*s],[x-W*.72,y+38*s],[x+W*.72,y+38*s]],color);
}
function landscape(c, theme, time='night', weather=true, tick=0, w=240, h=305){
 c.save(); c.imageSmoothingEnabled=false;
 sky(c,theme,time,w,h);
 if(theme==='manhattan'){
  R(c,0,216,240,89,time==='day'?'#657e91':'#243a54');
  for(let i=0;i<26;i++){let x=i*11-5,bt=103+Math.floor(hash(i*3+22)*77);R(c,x,bt,13,210,'#273c53');R(c,x+2,bt+8,9,2,'#415870');}
  for(let i=0;i<12;i++){
    let x=i*23-9, top=128+Math.floor(hash(i+38)*72), height=304-top;
    let col=i%3===0?'#293243':i%3===1?'#35445c':'#283b4f';
    R(c,x,top,24,height,col);R(c,x+3,top-4,18,4,col);R(c,x+7,top-11,6,7,col);
    if(i===4){R(c,x+10,top-35,2,25,'#778898');R(c,x+9,top-37,4,4,'#f4c3a2');}
    for(let y=top+8;y<287;y+=13)for(let j=0;j<3;j++)if(hash(i*20+j+y)>0.22)R(c,x+4+j*7,y,3,5,(time==='day')?'#9cb6ba':hash(i+j+y)>0.3?'#f7c78c':'#8594a8');
  }
  R(c,0,277,240,28,'#263040');R(c,0,279,240,3,'#76677a');
  R(c,14,270,33,9,'#282b38');R(c,19,255,23,15,'#4d4850');R(c,16,252,28,3,'#85818b');R(c,29,248,2,5,'#716c80');
  for(let i=0;i<9;i++)R(c,i*34-9,291,16,2,'#596176');
 }else if(theme==='kyoto'){
  mountain(c,199,'#839fa3',62,127,102);mountain(c,216,'#658e90',170,115,104);
  R(c,0,217,240,88,'#537c73');R(c,0,263,240,42,'#698c77');
  for(let i=0;i<12;i++)R(c,i*22-6,238+Math.floor(hash(i)*9),17,2,'#9ab2a1');
  // Pagoda roof lines and lanterns.
  R(c,146,192,35,55,'#735a57');R(c,154,180,20,15,'#a5816c');
  for(let k=0;k<3;k++){let y=183+k*18; P(c,[[140,y+8],[158,y],[171,y],[187,y+8],[184,y+11],[143,y+11]],'#3b5260');R(c,151,y+13,24,6,'#e5bb98');}
  R(c,162,171,2,13,'#4b4d54');
  // Cherry tree on left.
  R(c,30,183,8,122,'#56484b');R(c,12,211,40,6,'#56484b');
  for(let i=0;i<38;i++){
    let xx=12+Math.floor(hash(i+12)*86),yy=128+Math.floor(hash(i+39)*85);
    if((xx-43)*(xx-43)/2200+(yy-174)*(yy-174)/1800<1.7)R(c,xx,yy,5+i%2,4,i%4===0?'#f8dfd2':i%3===0?'#eeb4bd':'#f1c7ca');
  }
  R(c,0,279,240,26,'#9aab8d');
  for(let i=0;i<12;i++)R(c,i*23,278+(i%4)*4,12,2,'#d3b2ab');
 }else if(theme==='igloo'){
  mountain(c,230,'#6b9db7',70,140,104);mountain(c,250,'#96c4d3',193,160,105);
  R(c,0,243,240,62,'#cbebef');P(c,[[0,272],[45,250],[88,263],[141,244],[240,266],[240,305],[0,305]],'#e5f5f4');
  for(let i=0;i<22;i++)R(c,Math.floor(hash(i+4)*240),246+Math.floor(hash(i+66)*55),4,2,'#a5cfda');
  if(time==='night'){
   for(let k=0;k<4;k++){
    let col=['#61c8b4','#84dacc','#a18fc9','#61a6bb'][k];
    for(let i=0;i<22;i++){
      let x=i*13-9, y=53+k*14+Math.sin(i*.43+k)*20;
      R(c,x,y,14,6,col);
    }
   }
  }
  // Tiny distant snowhouse.
  R(c,176,255,30,17,'#a4d3de');R(c,169,263,44,10,'#deeff1');R(c,186,260,11,13,'#55768b');
 }else if(theme==='forest'){
  mountain(c,208,'#6a8180',79,122,112);mountain(c,226,'#446c67',184,144,130);
  R(c,0,216,240,89,'#315349');
  for(let i=0;i<17;i++)pine(c,Math.floor(hash(i+78)*255),180+Math.floor(hash(i+23)*28),.7+hash(i+6)*.8,i%2?'#234d42':'#315b49');
  R(c,81,240,85,54,'#8f6d4c');P(c,[[74,242],[125,201],[173,242]],'#514842');P(c,[[88,237],[125,209],[160,237]],'#7f5644');
  R(c,112,264,20,30,'#40392f');R(c,138,251,16,13,'#f4d59b');R(c,141,254,10,8,'#eac078');
  for(let i=0;i<17;i++)R(c,Math.floor(hash(i+41)*240),289+Math.floor(hash(i+9)*15),6,3,'#59785a');
 }else if(theme==='observatory'){
  // Huge ringed planet.
  R(c,146,67,40,42,'#b7a1cc');R(c,140,75,52,27,'#b7a1cc');R(c,154,60,24,48,'#d9aac4');R(c,147,88,45,9,'#9279b4');
  for(let i=0;i<3;i++){L(c,109+i*2,105+i*2,214+i*2,55+i*2,'#f6dbca',2);}
  mountain(c,218,'#3e4c79',57,154,110);mountain(c,250,'#5a4d79',174,160,116);
  R(c,0,245,240,60,'#343451');for(let i=0;i<12;i++)R(c,i*25+3,280+i%4*5,11,3,'#8976a0');
  // Distant observatory.
  R(c,30,215,63,65,'#5f5a76');R(c,23,218,75,6,'#342f4a');R(c,45,192,31,30,'#98a1bf');R(c,50,185,21,6,'#b3c2d4');R(c,58,180,4,9,'#b3c2d4');R(c,53,211,15,9,'#353650');
 }
 if(weather){
   const n=theme==='manhattan'?58:theme==='igloo'?42:theme==='kyoto'?23:theme==='forest'?13:0;
   for(let i=0;i<n;i++){
    let x=Math.floor((hash(i+129)*w+((tick*(theme==='manhattan'?5:.75))*(i%3+1)))%w);
    let y=Math.floor((hash(i+401)*h+(tick*(theme==='manhattan'?10:2))*(i%4+1))%h);
    if(theme==='manhattan')R(c,x,y,1,5,time==='day'?'#c6dce5a8':'#a3bcd6a0');
    if(theme==='igloo')R(c,x,y,2,2,'#edfbf5');
    if(theme==='kyoto')R(c,x,y,3,2,i%3===0?'#edabbf':'#f8d3d7');
    if(theme==='forest')R(c,x,y,1,3,'#daecbe');
   }
 }
 c.restore();
}
function renderLandscape(canvas,theme,time,weather,tick){
 if(!canvas)return;const c=canvas.getContext('2d'); if(!c)return; c.clearRect(0,0,canvas.width,canvas.height); landscape(c,theme,time,weather,tick,canvas.width,canvas.height);
}
function bookSpines(c,x,y,number,theme){
 const cols=['#d8ae8c','#7f9a9f','#b17f80','#e4cf97','#959fbd','#adad8c','#ca9474'];
 for(let i=0;i<number;i++){let xx=x+i*4,hh=19+(i*7)%11;R(c,xx,y-hh,3,hh,cols[i%7]);R(c,xx+1,y-hh+4,1,2,'#f7dfb3');}
}
function pet(c,animal='cat',x=0,y=0,scale=1,theme='manhattan',blink=false){
 c.save(); c.translate(x,y); c.scale(scale,scale);
 const dark='#263044',black='#192432',pink='#d7a69c',white='#e8d9c7';
 const eyes=blink?2:3;
 if(animal==='cat'){
  R(c,5,20,28,14,dark);R(c,2,16,32,16,'#77838d');R(c,3,25,32,8,'#64717f');
  R(c,4,7,9,12,'#77838d');R(c,23,7,9,12,'#77838d');R(c,8,3,5,10,'#77838d');R(c,26,3,4,10,'#77838d');
  R(c,7,16,25,14,'#92a4ab');R(c,11,20,3,eyes,black);R(c,24,20,3,eyes,black);R(c,19,26,3,2,pink);
  R(c,31,25,6,4,'#77838d');R(c,35,20,4,7,'#77838d');
 } else if(animal==='dog'){
  R(c,6,19,29,13,'#b28c67');R(c,5,25,31,8,'#997358');R(c,8,8,25,21,'#c7a37a');
  R(c,3,10,8,18,'#8a6452');R(c,30,10,8,17,'#8a6452');R(c,12,18,3,eyes,black);R(c,27,18,3,eyes,black);
  R(c,17,24,9,6,'#ecd4b2');R(c,20,24,4,3,dark);R(c,33,27,6,4,'#c7a37a');
 } else if(animal==='penguin'){
  R(c,11,4,21,33,'#252f49');R(c,7,9,30,22,'#252f49');R(c,13,12,18,20,'#e4eee6');
  R(c,13,15,3,eyes,'#e0ede7');R(c,28,15,3,eyes,'#e0ede7');R(c,15,17,3,2,black);R(c,27,17,3,2,black);
  R(c,19,22,8,3,'#e3a568');R(c,11,35,10,3,'#e6a46e');R(c,25,35,10,3,'#e6a46e');R(c,7,22,5,9,'#303955');
 }else if(animal==='fox'){
  R(c,4,12,31,21,'#bd6f4d');R(c,4,6,10,11,'#bd6f4d');R(c,25,6,10,11,'#bd6f4d');R(c,6,8,4,6,'#e5a7a0');R(c,29,8,4,6,'#e5a7a0');
  R(c,9,24,23,10,'#e6d4b3');R(c,14,19,3,eyes,black);R(c,25,19,3,eyes,black);R(c,20,26,4,3,black);
  R(c,32,27,10,8,'#bd6f4d');R(c,39,25,5,5,'#ece3ca');
 }else if(animal==='rabbit'){
  R(c,9,2,8,18,'#e7dacc');R(c,24,2,8,18,'#e7dacc');R(c,12,5,3,12,'#deaead');R(c,27,5,3,12,'#deaead');
  R(c,6,19,33,15,'#e7dacc');R(c,9,15,28,16,'#f6e8d7');R(c,14,22,3,eyes,black);R(c,27,22,3,eyes,black);R(c,21,27,3,2,pink);
 }else{
  R(c,8,14,30,18,'#37354d');R(c,12,8,22,18,'#4d4b61');R(c,27,19,13,6,'#d7ab77');R(c,21,18,3,eyes,'#ece1c7');R(c,22,19,2,2,black);
  R(c,6,19,9,9,'#353348');R(c,17,30,3,6,'#bc977b');R(c,28,30,3,6,'#bc977b');
 }
 c.restore();
}
function pixelRoom(canvas,theme='manhattan',animal='cat',counts={},time='night',tick=0){
 if(!canvas)return;
 const ctx=canvas.getContext('2d'); if(!ctx)return;
 const p=THEMES[theme]||THEMES.manhattan;const c=ctx;
 const B=()=>{};
 c.imageSmoothingEnabled=false;c.clearRect(0,0,240,270);
 // Wallpaper with dither and beams.
 R(c,0,0,240,270,p.wall);R(c,0,0,240,11,p.wallLight);R(c,0,11,240,3,p.woodDark);
 for(let y=15;y<180;y+=15)for(let x=0;x<240;x+=16){if(hash(x*3+y)>0.64)R(c,x+2,y+4,2,2,p.wallLight);}
 if(theme==='manhattan')for(let y=22;y<178;y+=19){L(c,0,y,240,y,'#52607a',1);for(let x=y%2?5:16;x<240;x+=29)R(c,x,y+2,1,13,'#52607a');}
 if(theme==='igloo')for(let y=20;y<174;y+=17){L(c,0,y,240,y,'#b1d3d9',1);for(let x=(y%34?4:17);x<240;x+=28)R(c,x,y+1,2,15,'#accbd3');}
 if(theme==='forest')for(let x=0;x<240;x+=32){R(c,x,8,3,172,'#4e473b');R(c,x+5,15,1,163,'#907858');}
 if(theme==='kyoto'){for(let x of [9,83,175,229])R(c,x,9,4,173,'#506d67');R(c,0,16,240,4,'#b0aa87');}
 if(theme==='observatory')for(let i=0;i<15;i++)star(c,Math.floor(hash(i+29)*240),Math.floor(hash(i+3)*157)+14,'#827b99');
 R(c,0,179,240,91,p.floor);R(c,0,176,240,8,p.woodDark);R(c,0,178,240,3,p.frame);
 for(let y=192;y<270;y+=23){R(c,0,y,240,1,p.floorLine);for(let x=(y%3)*8;x<240;x+=45)R(c,x,y+1,1,22,p.floorLine);}
 // Floor rug, pixel diamond border.
 R(c,75,222,125,39,p.woodDark);R(c,78,225,118,32,p.rug);R(c,82,229,110,24,p.rug2);R(c,88,233,98,15,p.rug);R(c,103,238,68,5,p.rug2);
 // Window: outdoor miniature.
 R(c,89,18,83,99,p.woodDark);R(c,93,22,75,90,p.frame);R(c,97,26,67,82,'#25354b');
 const off=document.createElement('canvas');off.width=240;off.height=305;const oc=off.getContext('2d');landscape(oc,theme,time,true,tick,240,305);
 c.drawImage(off,5,12,230,280,97,26,67,82);
 R(c,94,21,73,4,p.light);R(c,94,109,75,5,p.woodDark);R(c,128,25,4,83,p.frame);R(c,98,68,66,4,p.frame);
 R(c,91,18,80,3,p.frame);R(c,87,113,88,6,p.woodDark);R(c,90,113,84,2,p.light);
 R(c,100,29,2,34,'#ffffff3a');R(c,103,29,1,15,'#ffffff2b');
 // Tiny curtains.
 if(theme==='kyoto'){R(c,94,24,6,41,'#d2b9a8');R(c,159,24,7,40,'#d2b9a8');}
 if(theme==='manhattan'){R(c,94,24,4,20,'#b38c87');R(c,164,24,3,20,'#b38c87');}
 if(theme==='observatory'){R(c,95,24,4,46,'#8c7599');R(c,163,24,4,46,'#8c7599');}
 // Shelving cabinet.
 R(c,9,25,76,137,p.woodDark);R(c,12,28,70,130,p.wood);R(c,17,33,61,121,p.out);
 for(let y of [68,105,143]){R(c,15,y,65,5,p.wood);R(c,15,y+5,65,2,p.woodDark);}
 bookSpines(c,20,67,Math.min(13,Math.max(5,(counts.books||0)+(counts.comics||0)+(counts.manga||0)+4)),theme);
 R(c,64,54,10,12,'#708b9d');R(c,65,52,8,3,'#ebcfa8');R(c,70,49,3,4,'#e8bc82');
 R(c,20,98,22,5,'#9aa4a7');R(c,22,91,18,7,'#b49e92');R(c,47,79,13,19,'#d7ae96');R(c,50,77,7,4,'#e5d0b7');R(c,64,84,9,14,'#91a8a4');
 R(c,22,126,28,5,'#d0ab97');R(c,24,117,24,9,'#829d9b');R(c,53,116,18,12,'#cdbd98');R(c,53,111,18,5,'#7c8e9b');
 R(c,20,146,53,8,p.woodDark);R(c,24,149,6,4,p.light);R(c,68,149,6,4,p.light);
 // Small picture on far right.
 R(c,182,28,45,43,p.woodDark);R(c,185,31,39,37,p.frame);R(c,188,34,33,31,'#3e5570');
 if(theme==='observatory'){star(c,203,42,'#fff1c4',4);R(c,192,54,27,6,'#876d9f');}
 else {R(c,195,46,21,13,p.wallLight);P(c,[[190,60],[200,48],[211,62]],p.rug);}
 // Hanging lamp.
 R(c,193,0,2,12,p.frame);R(c,184,12,21,4,p.woodDark);R(c,189,16,12,11,p.light);R(c,185,27,20,3,p.woodDark);R(c,188,30,14,3,'#ffffff30');
 // Television and film corner.
 R(c,164,98,69,63,p.woodDark);R(c,169,101,59,48,'#192535');R(c,173,105,48,40,'#4f6576');R(c,177,109,40,32,'#172e4a');
 // VHS playback screen with theme colors.
 R(c,180,113,34,22,'#304862');R(c,181,125,32,10,p.rug);R(c,185,116,9,9,'#dfc7a4');R(c,191,117,4,11,'#8e667c');R(c,198,119,11,14,'#85929a');
 R(c,207,137,7,2,'#e8c5a7');R(c,225,110,3,4,p.light);R(c,223,122,4,4,p.frame);
 R(c,174,152,47,7,p.woodDark);R(c,182,159,33,4,p.wood);R(c,177,162,45,7,p.woodDark);
 R(c,177,172,54,12,p.wood);R(c,180,173,48,8,p.out);
 for(let i=0;i<4;i++){R(c,184+i*10,175,7,4,['#a07a82','#718ca5','#caa283','#8c9e8f'][i]);}
 // Game console, sitting near screen.
 R(c,175,191,55,11,'#c3b7ab');R(c,180,193,43,6,'#4b5362');R(c,194,194,8,2,p.light);
 R(c,178,205,19,12,'#6a7782');R(c,200,205,19,12,'#6a7782');R(c,183,210,8,2,'#f0d1a0');R(c,186,207,2,8,'#f0d1a0');
 for(let [x,y] of [[209,209],[214,213]])R(c,x,y,3,3,'#f0c48f');
 // Hobby work desk.
 R(c,8,177,103,9,p.woodDark);R(c,11,171,96,7,p.wood);R(c,16,185,7,41,p.woodDark);R(c,96,185,7,41,p.woodDark);
 R(c,23,183,67,22,p.woodDark);R(c,26,184,61,19,p.wood);R(c,34,192,5,4,p.light);R(c,79,192,5,4,p.light);
 // Model, brushes, paints.
 R(c,32,156,21,13,'#778d82');R(c,35,152,15,5,'#e3c6a6');R(c,39,147,8,6,'#9eb8a4');R(c,43,142,2,6,'#d5ad87');
 for(let i=0;i<4;i++){R(c,57+i*9,163,6,8,['#93b4a7','#ce9b8c','#d6c79f','#a6a2ca'][i]);R(c,58+i*9,160,4,3,'#e3d8c4');}
 R(c,16,163,5,12,'#c7a18a');R(c,18,150,1,13,'#f9d9ac');R(c,21,155,1,10,'#a9d4d9');
 R(c,92,152,3,19,'#d3bf96');R(c,87,155,13,4,'#d3bf96');R(c,90,158,7,2,'#efd2a9');
 // Scattered hobby tools on table.
 R(c,38,169,16,2,'#b0c7c0');R(c,55,170,13,2,'#eed5ab');
 // Framed record album and notebook.
 R(c,125,161,26,26,p.woodDark);R(c,128,164,20,19,'#bfaaa0');R(c,130,165,16,16,'#3f4b65');R(c,134,169,9,9,'#d4a88a');R(c,138,172,3,3,'#36465a');
 R(c,120,187,39,10,'#d6bca1');R(c,123,190,34,4,'#8e788d');R(c,151,187,3,10,'#65526e');
 // A plant on sill.
 R(c,152,105,7,6,'#c49e89');R(c,155,92,2,14,'#5e9b76');R(c,151,94,4,7,'#71a584');R(c,157,92,4,5,'#638f7a');
 // Floor scattered pixels.
 for(let i=0;i<15;i++){let x=7+i*17,y=235+Math.floor(hash(i+9)*31); R(c,x,y,3,1,p.floorLine);}
 // Pet and cushion.
 R(c,90,218,57,22,p.woodDark);R(c,94,220,50,15,p.rug2);R(c,96,232,47,5,p.rug);
 pet(c,animal,98,201,1.1,theme,Math.floor(tick)%9===0);
 // Foreground shelf / postcard.
 R(c,7,239,38,24,p.woodDark);R(c,10,242,32,18,p.frame);R(c,13,244,26,14,p.wallLight);R(c,14,251,24,2,p.light);
 R(c,197,237,32,23,p.woodDark);R(c,201,239,24,19,p.wood);R(c,206,232,13,10,'#a6ad98');R(c,209,230,7,4,'#e9d0b2');
 // Corners and shadow border.
 R(c,0,0,4,270,p.out);R(c,236,0,4,270,p.out);R(c,0,266,240,4,p.out);
}
function previewTheme(canvas,theme){
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,240,150);
 const off=document.createElement('canvas');off.width=240;off.height=305;const oc=off.getContext('2d');landscape(oc,theme,theme==='kyoto'?'day':theme==='forest'?'dusk':'night',false,0,240,305);c.drawImage(off,0,0,240,305,0,0,240,150);
}
function petPreview(canvas,animal){const c=canvas.getContext('2d');c.clearRect(0,0,66,66); c.imageSmoothingEnabled=false;pet(c,animal,9,9,1.3,'manhattan',false);}
window.PixelWorld={THEMES,PETS,room:pixelRoom,landscape:renderLandscape,themePreview:previewTheme,petPreview};
})();
