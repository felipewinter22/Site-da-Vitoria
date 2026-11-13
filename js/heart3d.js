/* Coração 3D interativo (Three.js) */
(function(){
const box=document.getElementById('heart3d');
if(!box||!window.THREE){box&&(box.textContent='❤️',box.style.fontSize='8rem');return}
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(R.domElement);
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(40,1,.1,50);C.position.z=6;
// forma do coração (curva paramétrica clássica)
const sh=new THREE.Shape();
for(let i=0;i<=64;i++){const t=i/64*Math.PI*2,x=16*Math.pow(Math.sin(t),3)/16,y=(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/16;i?sh.lineTo(x,y):sh.moveTo(x,y)}
const g=new THREE.ExtrudeGeometry(sh,{depth:.35,bevelEnabled:true,bevelThickness:.35,bevelSize:.3,bevelSegments:14,curveSegments:64});
g.center();
const heart=new THREE.Mesh(g,new THREE.MeshPhysicalMaterial({color:0xc4164f,roughness:.22,metalness:.1,clearcoat:1,clearcoatRoughness:.12,emissive:0x4a0020,emissiveIntensity:.6}));
const pivot=new THREE.Group();pivot.add(heart);pivot.scale.setScalar(1.25);S.add(pivot);
S.add(new THREE.HemisphereLight(0xffd9e2,0x4a0c27,.9));
const l1=new THREE.PointLight(0xff7aa0,60,20);l1.position.set(3,3,4);S.add(l1);
const l2=new THREE.PointLight(0xffc89a,30,20);l2.position.set(-4,-1,3);S.add(l2);
// mini corações orbitando
const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d');x.fillStyle='#fff';x.font='52px serif';x.textAlign='center';x.fillText('♥',32,50);
const N=reduce?30:90,P=new Float32Array(N*3),D=[];
for(let i=0;i<N;i++)D.push({r:2.4+Math.random()*1.6,a:Math.random()*6.28,y:(Math.random()-.5)*4,s:.1+Math.random()*.25});
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(P,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({size:.2,map:new THREE.CanvasTexture(cv),color:0xff9db8,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
pts.frustumCulled=false;S.add(pts);
let ry=0,rx=0,vy=reduce?0:.004,vx=0,drag=false,moved=0,lx=0,ly=0,pulse=0,burst=0,vis=true,raf=0;
function size(){const w=box.clientWidth;R.setSize(w,w,false);C.aspect=1;C.updateProjectionMatrix()}
addEventListener('resize',size);size();
const el=R.domElement;
el.addEventListener('pointerdown',e=>{drag=true;moved=0;lx=e.clientX;ly=e.clientY;el.setPointerCapture(e.pointerId)});
el.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);vy=dx*.01;vx=dy*.01;ry+=vy;rx=Math.max(-1,Math.min(1,rx+vx))});
el.addEventListener('pointerup',()=>{drag=false;if(moved<6)box.dispatchEvent(new CustomEvent('heart-tap'));if(!reduce&&Math.abs(vy)<.004)vy=.004});
el.addEventListener('pointercancel',()=>drag=false);
box.addEventListener('heart-tap',()=>{pulse=1;burst=1});
function frame(t){
  raf=vis?requestAnimationFrame(frame):0;
  t*=.001;
  if(!drag){ry+=vy;if(!reduce)vy+=(.004-vy)*.02;rx*=.96}
  // batimento "lub-dub"
  const ph=reduce?0:(t%1.1)/1.1,b=Math.max(Math.exp(-Math.pow((ph-.08)*14,2)),.7*Math.exp(-Math.pow((ph-.28)*14,2)));
  pulse*=.93;const k=1+.06*b+.18*pulse;
  pivot.scale.setScalar(1.25*k);pivot.rotation.set(rx,ry,0);
  heart.material.emissiveIntensity=.5+b*.9+pulse*1.5;
  burst*=.95;
  for(let i=0;i<N;i++){const d=D[i];d.a+=d.s*.01;const r=d.r+burst*2.5;P[i*3]=Math.cos(d.a)*r;P[i*3+1]=d.y+Math.sin(t*d.s*3+i)*.2+burst*d.y*.5;P[i*3+2]=Math.sin(d.a)*r}
  pg.attributes.position.needsUpdate=true;
  R.render(S,C);
}
// só renderiza quando visível
new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(frame)}).observe(box);
})();
