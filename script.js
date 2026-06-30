// Mobile nav
const mobNav=document.getElementById('mobNav');
document.getElementById('hbg').onclick=()=>mobNav.classList.add('open');
document.getElementById('mobClose').onclick=()=>mobNav.classList.remove('open');
document.querySelectorAll('.mob-nav a').forEach(a=>a.onclick=()=>mobNav.classList.remove('open'));

// Nav scroll (native + Lenis compatible)
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('sc',window.scrollY>30),{passive:true});

// Scroll reveal
document.querySelectorAll('.rv').forEach(el=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');}),{threshold:.08}).observe(el));

// Stars
(function(){
  const cv=document.getElementById('stars'),ctx=cv.getContext('2d');
  let w,h,stars=[],scrollY=0;
  function resize(){w=cv.width=window.innerWidth;h=cv.height=window.innerHeight;}
  function init(){
    stars=[];const n=Math.floor(w*h/4200);
    for(let i=0;i<n;i++)stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+0.2,a:Math.random()*.6+.2,sp:Math.random()*.14+.02,tw:Math.random()*Math.PI*2,tws:Math.random()*.009+.003,col:Math.random()<.12?'#4fffb0':Math.random()<.08?'#00c6ff':'#fff'});
  }
  resize();window.addEventListener('resize',()=>{resize();init();});init();
  window.addEventListener('scroll',()=>scrollY=window.scrollY,{passive:true});
  function draw(){
    ctx.clearRect(0,0,w,h);
    stars.forEach(s=>{s.tw+=s.tws;const a=s.a*(.7+.3*Math.sin(s.tw));ctx.save();ctx.globalAlpha=a;ctx.fillStyle=s.col;ctx.beginPath();ctx.arc(s.x,s.y-scrollY*s.sp*.08,s.r,0,Math.PI*2);ctx.fill();ctx.restore();});
    requestAnimationFrame(draw);
  }
  draw();
})();

// Carousel
function makeCarousel(slidesId,prevId,nextId,dotsId){
  const slides=document.getElementById(slidesId);
  const total=slides.children.length;
  const dots=[...document.getElementById(dotsId).children];
  let cur=0,isAnimating=false;
  function go(n){if(isAnimating)return;isAnimating=true;cur=(n+total)%total;slides.style.transform=`translateX(-${cur*100}%)`;dots.forEach((d,i)=>d.classList.toggle('active',i===cur));setTimeout(()=>isAnimating=false,520);}
  document.getElementById(prevId).onclick=()=>go(cur-1);
  document.getElementById(nextId).onclick=()=>go(cur+1);
  dots.forEach((d,i)=>d.onclick=()=>go(i));
  let startX=0;
  slides.parentElement.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});
  slides.parentElement.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>40)go(dx<0?cur+1:cur-1);});
  let timer=setInterval(()=>go(cur+1),5000);
  slides.parentElement.addEventListener('mouseenter',()=>clearInterval(timer));
  slides.parentElement.addEventListener('mouseleave',()=>timer=setInterval(()=>go(cur+1),5000));
}
makeCarousel('cvSlides','cvPrev','cvNext','cvDots');
makeCarousel('quantSlides','quantPrev','quantNext','quantDots');

// 3D World (right-side container)
(function(){
  const container=document.getElementById('worldContainer');
  if(!container)return;
  const viewport=document.getElementById('viewport');
  const world=document.getElementById('world');
  const items=[];

  // Config (smaller for container)
  const CONFIG={
    itemCount:8,
    starCount:40,
    zGap:500,
    camSpeed:1.2,
    colors:['#ff003c','#00f3ff','#ccff00','#ffffff']
  };

  const TEXTS=["IMPACT","VELOCITY","BRUTAL","SYSTEM","FUTURE","DESIGN","PIXEL","HYPER"];

  // State
  const state={scroll:0,velocity:0,targetSpeed:0,mouseX:0,mouseY:0};
  let W=container.clientWidth;
  let H=container.clientHeight;

  function createItems(){
    items.length=0;
    world.innerHTML='';
    for(let i=0;i<CONFIG.itemCount;i++){
      const el=document.createElement('div');
      el.className='item';
      const isHeading=i%4===0;
      if(isHeading){
        const txt=document.createElement('div');
        txt.className='big-text';
        txt.innerText=TEXTS[i%TEXTS.length];
        el.appendChild(txt);
        items.push({el,type:'text',x:0,y:0,rot:0,baseZ:-i*CONFIG.zGap});
      }else{
        const card=document.createElement('div');
        card.className='card';
        const randId=Math.floor(Math.random()*9999);
        card.innerHTML=`
          <div class="card-header">
            <span class="card-id">ID-${randId}</span>
            <div style="width:6px;height:6px;background:var(--accent);"></div>
          </div>
          <h2>${TEXTS[i%TEXTS.length]}</h2>
          <div class="card-footer">
            <span>GRID: ${Math.floor(Math.random()*10)}x${Math.floor(Math.random()*10)}</span>
          </div>
        `;
        el.appendChild(card);
        const angle=(i/CONFIG.itemCount)*Math.PI*6;
        const x=Math.cos(angle)*(W*0.25);
        const y=Math.sin(angle)*(H*0.25);
        const rot=(Math.random()-0.5)*30;
        items.push({el,type:'card',x,y,rot,baseZ:-i*CONFIG.zGap});
      }
      world.appendChild(el);
    }
    // Stars
    for(let i=0;i<CONFIG.starCount;i++){
      const el=document.createElement('div');
      el.className='star';
      world.appendChild(el);
      items.push({el,type:'star',x:(Math.random()-0.5)*1200,y:(Math.random()-0.5)*1200,baseZ:-Math.random()*CONFIG.itemCount*CONFIG.zGap});
    }
  }
  createItems();

  // Mouse tracking relative to container
  container.addEventListener('mousemove',e=>{
    const r=container.getBoundingClientRect();
    state.mouseX=((e.clientX-r.left)/r.width-0.5)*2;
    state.mouseY=((e.clientY-r.top)/r.height-0.5)*2;
  });
  container.addEventListener('mouseleave',()=>{state.mouseX=0;state.mouseY=0;});

  // Animation loop
  let lenisScroll=0, lastTime2=0;

  function animateWorld(time){
    lenisScroll=window.scrollY||0;

    // Smooth auto-scroll
    state.targetSpeed=0.5+Math.sin(time*0.0003)*0.3;
    state.velocity+=(state.targetSpeed-state.velocity)*0.05;

    // Recalculate dimensions
    W=container.clientWidth;
    H=container.clientHeight;

    // Camera tilt (mouse + auto drift)
    const driftX=Math.sin(time*0.0005)*3;
    const driftY=Math.cos(time*0.0004)*3;
    const tiltX=state.mouseY*8+driftX;
    const tiltY=state.mouseX*8+driftY;

    world.style.transform=`rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    // Dynamic perspective
    const baseFov=800;
    const fov=baseFov-Math.min(Math.abs(state.velocity)*30,300);
    viewport.style.perspective=`${fov}px`;

    // Item positions
    const cameraZ=lenisScroll*CONFIG.camSpeed+time*0.05;
    const modC=CONFIG.itemCount*CONFIG.zGap;

    items.forEach(item=>{
      let relZ=item.baseZ+cameraZ;
      let vizZ=((relZ%modC)+modC)%modC;
      if(vizZ>500)vizZ-=modC;

      let alpha=1;
      if(vizZ<-2000)alpha=0;
      else if(vizZ<-1000)alpha=(vizZ+2000)/1000;
      if(vizZ>100&&item.type!=='star')alpha=1-((vizZ-100)/300);
      if(alpha<0)alpha=0;
      item.el.style.opacity=alpha;

      if(alpha>0){
        let trans=`translate3d(${item.x}px,${item.y}px,${vizZ}px)`;
        if(item.type==='star'){
          const stretch=Math.max(1,Math.min(1+Math.abs(state.velocity)*0.15,8));
          trans+=` scale3d(1,1,${stretch})`;
        }else if(item.type==='text'){
          trans+=` rotateZ(${item.rot}deg)`;
          if(Math.abs(state.velocity)>0.5){
            const offset=state.velocity*3;
            item.el.style.textShadow=`${offset}px 0 red, ${-offset}px 0 cyan`;
          }else item.el.style.textShadow='none';
        }else{
          const float=Math.sin(time*0.001+item.x)*8;
          trans+=` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
        }
        item.el.style.transform=trans;
      }
    });

    requestAnimationFrame(animateWorld);
  }
  requestAnimationFrame(animateWorld);
})();
