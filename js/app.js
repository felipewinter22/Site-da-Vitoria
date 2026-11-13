(function(){
'use strict';
const $=s=>document.querySelector(s),CF=window.CONFIG;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const pad=n=>String(n).padStart(2,'0');

/* ---------- Toast e explosão de corações ---------- */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2800)}
function burst(x,y,n=14){if(reduce)n=4;const e=['💗','💖','💕','❤️','💘'];
  for(let i=0;i<n;i++){const h=document.createElement('span'),a=Math.random()*6.28,d=60+Math.random()*140;
    h.className='fx';h.textContent=e[i%5];h.style.cssText=`left:${x}px;top:${y}px;font-size:${14+Math.random()*18}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-80}px;--rot:${Math.random()*80-40}deg`;
    document.body.appendChild(h);setTimeout(()=>h.remove(),1700)}}

/* ---------- Corações flutuando ao fundo ---------- */
(function(){const c=$('#bg'),x=c.getContext('2d');let W,H,hs=[],on=!reduce;
  function rs(){const r=Math.min(devicePixelRatio,2);W=c.width=innerWidth*r;H=c.height=innerHeight*r;x.setTransform(r,0,0,r,0,0)}
  addEventListener('resize',rs);rs();
  const n=innerWidth<600?10:18;
  for(let i=0;i<n;i++)hs.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,s:8+Math.random()*18,v:.15+Math.random()*.35,p:Math.random()*6,a:.1+Math.random()*.25});
  function draw(){x.clearRect(0,0,W,H);x.textAlign='center';
    for(const h of hs){if(on){h.y-=h.v;h.p+=.012;if(h.y<-30){h.y=innerHeight+30;h.x=Math.random()*innerWidth}}
      x.globalAlpha=h.a;x.fillStyle='#ff8fab';x.font=h.s+'px serif';x.fillText('♥',h.x+Math.sin(h.p)*14,h.y)}
    if(on)requestAnimationFrame(draw)}
  draw();document.addEventListener('visibilitychange',()=>{const v=!document.hidden&&!reduce;if(v&&!on){on=true;draw()}else on=v})})();

/* ---------- Login (preservado) ---------- */
const box=$('#login-box');
box.addEventListener('submit',e=>{e.preventDefault();
  if($('#usuario').value===CF.usuario&&$('#senha').value===CF.senha){
    $('#login-overlay').classList.add('out');document.body.classList.remove('lock');
    $('#conteudo').hidden=false;$('#pergunta-namoro').hidden=false;
    setTimeout(()=>{$('#login-overlay').style.display='none'},900);start();
  }else{$('#erro').textContent='Usuário ou senha incorretos.';box.classList.remove('erro');void box.offsetWidth;box.classList.add('erro')}});

/* ---------- Pergunta: "Sim" e "Não" que foge ---------- */
const nao=$('#btn-nao'),cx=$('#caixa-namoro');
function foge(){const m=cx.clientWidth-nao.offsetWidth-20,v=cx.clientHeight-nao.offsetHeight-20;
  nao.style.position='absolute';nao.style.left=10+Math.random()*m+'px';nao.style.top=10+Math.random()*v+'px'}
['mouseover','touchstart','focus'].forEach(ev=>nao.addEventListener(ev,e=>{if(ev==='touchstart')e.preventDefault();foge()},{passive:false}));
$('#btn-sim').addEventListener('click',e=>{
  const r=e.target.getBoundingClientRect();burst(r.left+r.width/2,r.top,40);
  $('#pergunta-namoro').hidden=true;toast('Eu sabia que você ia dizer sim! 😍')});

/* ---------- Início da experiência ---------- */
function start(){
  // frase: palavras entram uma a uma
  const f=$('#frase');let i=0;
  f.innerHTML=f.innerHTML.split(/(<br>)/).map(p=>p==='<br>'?p:p.split(' ').map(w=>`<span class="w" style="animation-delay:${.4+(i++)*.18}s">${w}</span>`).join(' ')).join('');
  $('#assinatura').textContent=CF.assinatura;
  // reveal ao rolar
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.rv,.tl li,.galeria figure').forEach(el=>io.observe(el));
  // parallax suave
  if(!reduce){const p=$('[data-par]');let y=0,q=false;
    addEventListener('scroll',()=>{y=scrollY;if(!q){q=true;requestAnimationFrame(()=>{p.style.transform=`translateY(${y*.35}px)`;p.style.opacity=Math.max(0,1-y/(innerHeight*.8));q=false})}},{passive:true})}
}

/* ---------- Cronômetro (mesma lógica de antes) ---------- */
const ini=new Date(CF.inicio);
function cron(){const a=new Date();let A=a.getFullYear()-ini.getFullYear(),M=a.getMonth()-ini.getMonth(),D=a.getDate()-ini.getDate(),h=a.getHours()-ini.getHours(),m=a.getMinutes()-ini.getMinutes(),s=a.getSeconds()-ini.getSeconds();
  if(s<0){s+=60;m--}if(m<0){m+=60;h--}if(h<0){h+=24;D--}
  if(D<0){M--;D+=new Date(a.getFullYear(),a.getMonth(),0).getDate()}if(M<0){M+=12;A--}
  const c=(v,l)=>`<span><b>${v}</b><small>${l}</small></span>`;
  $('#cronometro').innerHTML=`<span class="pre">Estamos juntos há</span>`+c(A,A==1?'ano':'anos')+c(M,M==1?'mês':'meses')+c(D,D==1?'dia':'dias')+c(pad(h),'horas')+c(pad(m),'min')+c(pad(s),'seg');
  $('#cronometro').setAttribute('aria-label',`Estamos juntos há: ${A} ano(s), ${M} mês(es), ${D} dia(s), ${pad(h)}:${pad(m)}:${pad(s)}`)}
cron();setInterval(cron,1000);

/* ---------- Linha do tempo (só datas calculadas a partir da data real) ---------- */
(function(){const a=new Date(),t=[],fm=d=>d.toLocaleDateString('pt-BR');
  t.push([fm(ini),'Começou a nossa história']);
  for(let n=1;;n++){const d=new Date(ini);d.setFullYear(ini.getFullYear()+n);if(d>a)break;t.push([fm(d),n+(n==1?' ano':' anos')+' juntos'])}
  const dias=Math.floor((a-ini)/864e5);t.push(['Hoje',dias.toLocaleString('pt-BR')+' dias de nós, e contando']);
  $('#tl').innerHTML=t.map(([d,h])=>`<li><time>${d}</time><h3>${h}</h3></li>`).join('')})();

/* ---------- Coração: mensagens ao tocar ---------- */
const fr=['Só você sabe o quanto é importante pra mim!','Você é o amor da minha vida.','Sua presença deixa meus dias mais leves.','Eu te amo mais do que palavras podem dizer.','Obrigado por ser exatamente quem você é.'];let fi=0;
$('#heart3d').addEventListener('heart-tap',e=>{const m=$('#msg-coracao'),r=$('#heart3d').getBoundingClientRect();
  m.style.opacity=0;setTimeout(()=>{m.textContent=fr[fi++%fr.length];m.style.opacity=1},200);burst(r.left+r.width/2,r.top+r.height/2,12);
  if(navigator.vibrate&&!reduce)navigator.vibrate([40,60,40])});

/* ---------- Carta ---------- */
const env=$('#env');
env.addEventListener('click',()=>{const o=!env.classList.contains('open');
  if(o)env.style.setProperty('--h',$('.mensagem').offsetHeight+56+'px');
  env.classList.toggle('open',o);env.setAttribute('aria-expanded',o);
  $('#dica-carta').textContent=o?'Toque novamente para guardar':'Toque no envelope para abrir';
  if(o){const r=env.getBoundingClientRect();burst(r.left+r.width/2,r.top+40,10)}});

/* ---------- Álbum + lightbox ---------- */
const fotos=CF.fotos,G=$('#galeria'),lb=$('#lb'),li=lb.querySelector('img');let cur=0;
G.innerHTML=fotos.map(([f,w,h],i)=>`<figure tabindex="0" role="button" aria-label="Ampliar foto ${i+1} de ${fotos.length}" data-i="${i}" style="--r:${[-2.5,1.8,-1.2,2.6,-2][i%5]}deg"><div class="ph"><img src="img/t/${f}" width="${w}" height="${h}" alt="Foto ${i+1} do nosso álbum" loading="lazy" decoding="async"></div></figure>`).join('');
function show(i){cur=(i+fotos.length)%fotos.length;li.src=fotos[cur][0];li.alt='Foto '+(cur+1);lb.querySelector('.lb-c').textContent=`${cur+1} / ${fotos.length}`}
function open(i){show(i);lb.hidden=false;document.body.classList.add('lock');lb.querySelector('.lb-x').focus()}
function close(){lb.hidden=true;document.body.classList.remove('lock')}
G.addEventListener('click',e=>{const f=e.target.closest('figure');f&&open(+f.dataset.i)});
G.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const f=e.target.closest('figure');if(f){e.preventDefault();open(+f.dataset.i)}}});
lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=()=>show(cur-1);lb.querySelector('.lb-n').onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb)close()});
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))});
// pré-carrega vizinhas
lb.addEventListener('click',()=>{[cur+1,cur-1].forEach(j=>{new Image().src=fotos[(j+fotos.length)%fotos.length][0]})});

/* ---------- Surpresas escondidas ---------- */
(function(){let n=0;const msgs=['Achou um! 💗 (1/3)','Mais um coração escondido! 💕 (2/3)','Você achou todos os segredos. Eu te amo! 💖'];
  [['#coracao','right:8%;top:12%'],['#historia','left:6%;bottom:6%'],['footer','right:12%;top:30%']].forEach(([s,p])=>{
    const el=$(s);if(getComputedStyle(el).position==='static')el.style.position='relative';
    const b=document.createElement('button');b.className='secret';b.textContent='♥';b.style.cssText=p;b.setAttribute('aria-label','Coração escondido');
    b.onclick=e=>{b.remove();toast(msgs[n++]);burst(e.clientX,e.clientY,n==3?50:12)};el.appendChild(b)})})();
})();
