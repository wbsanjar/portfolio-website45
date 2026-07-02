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

// Superman Animation
(function() {
  const supes = document.getElementById('superman');
  const canvas = document.getElementById('supermanTrail');
  if (!supes) return;

  let t = 0;
  let w, h;
  const trail = [];
  const maxTrail = 100;

  function updateBounds() {
    w = window.innerWidth;
    h = window.innerHeight;
    if (canvas) { canvas.width = w; canvas.height = h; }
  }
  updateBounds();
  window.addEventListener('resize', updateBounds);

  const ctx = canvas ? canvas.getContext('2d') : null;

  function animate() {
    t += 0.005;

    const pad = 80;
    const cx = w / 2, cy = h / 2;
    const rx = Math.max(w / 2 - pad, 100);
    const ry = Math.max(h / 2 - pad, 100);

    const x = cx + Math.sin(t * 0.35) * rx * 0.55 + Math.sin(t * 0.85) * rx * 0.25 + Math.sin(t * 1.6) * rx * 0.1;
    const y = cy + Math.cos(t * 0.3) * ry * 0.45 + Math.cos(t * 1.1) * ry * 0.3 + Math.sin(t * 2.0) * ry * 0.12;

    const dx = Math.cos(t * 0.35) * rx * 0.55 * 0.35 + Math.cos(t * 0.85) * rx * 0.25 * 0.85 + Math.cos(t * 1.6) * rx * 0.1 * 1.6;
    const dy = -Math.sin(t * 0.3) * ry * 0.45 * 0.3 - Math.sin(t * 1.1) * ry * 0.3 * 1.1 + Math.cos(t * 2.0) * ry * 0.12 * 2.0;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    supes.style.left = x + 'px';
    supes.style.top = y + 'px';
    supes.style.transform = 'rotate(' + angle + 'deg)';

    // Speed trail
    if (ctx) {
      trail.push({ x, y });
      if (trail.length > maxTrail) trail.shift();

      ctx.clearRect(0, 0, w, h);
      if (trail.length > 2) {
        for (let i = 2; i < trail.length; i++) {
          const frac = i / trail.length;
          const a = frac * 0.25;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = 'rgba(255,200,50,' + a + ')';
          ctx.lineWidth = 2 + frac * 3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        for (let i = 2; i < trail.length; i++) {
          const frac = i / trail.length;
          const a = frac * 0.1;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = 'rgba(255,50,50,' + a + ')';
          ctx.lineWidth = 5 + frac * 6;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

// ============================
// DO NOT CLOSE 404 — GAME
// ============================
let brutalTimer = null;
let timeLeft = 60;
let gameLocked = false;
let audioContext = null;
let droneOscillator = null;

function enterApp() {
  const title = document.getElementById("titleScreen");
  const dash = document.getElementById("dashboard");
  if (!title || !dash) return;
  title.style.display = "none";
  dash.style.display = "block";
  startIntro();
}

function leaveApp() {
  const terminal = document.getElementById("terminal");
  hardGlitch();
  terminal.innerHTML = `<p style="color:red;">Exit attempt detected.</p><p>Leaving is not permitted.</p>`;
  setTimeout(() => { enterApp(); }, 1500);
}

function startIntro() {
  typeTerminal([
    "Initializing secure shell...",
    "Connecting to remote node...",
    "Decrypting memory blocks...",
    "User presence detected...",
    "Anomaly scanning..."
  ]);
  setTimeout(() => { if (!gameLocked) triggerCorruptedTile(); }, 6000);
}

function triggerCorruptedTile() {
  const terminal = document.getElementById("terminal");
  terminal.innerHTML += `<p style="color:#ff0033;">Anomaly detected.</p><p>Node integrity compromised.</p><p id="corruptTile" style="display:inline-block;padding:10px 16px;margin-top:8px;background:#ff0033;color:white;font-weight:bold;cursor:pointer;">??</p>`;
  const tile = document.getElementById("corruptTile");
  tile.addEventListener("click", function(){
    tile.style.background = "darkred";
    tile.textContent = "?";
    hardGlitch();
    setTimeout(() => {
      terminal.innerHTML = `<p style="color:#ff0033;">Curiosity level increased.</p><p>User interaction logged.</p><p>Escalation confirmed.</p>`;
      setTimeout(() => { startPuzzleOne(); }, 2500);
    }, 2000);
  });
}

function typeTerminal(lines) {
  const terminal = document.getElementById("terminal");
  terminal.innerHTML = "";
  let index = 0;
  function typeLine() {
    if (index < lines.length) {
      const p = document.createElement("p");
      p.textContent = lines[index];
      terminal.appendChild(p);
      index++;
      setTimeout(typeLine, 700);
    }
  }
  typeLine();
}

function startPuzzleOne() {
  const terminal = document.getElementById("terminal");
  terminal.innerHTML = `<p>Security Verification Required</p><p>If system says "Do Not Close"</p><p>and user tries to leave</p><p>who controls the session?</p><br>`;
  const input = createInput();
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkPuzzleOne(input.value);
  });
}

function checkPuzzleOne(answer) {
  const cleaned = answer.trim().toLowerCase();
  if (cleaned === "system") {
    hardGlitch();
    setTimeout(() => { startPuzzleTwo(); }, 2000);
  } else {
    hardGlitch();
  }
}

function startPuzzleTwo() {
  clearInterval(brutalTimer);
  timeLeft = 60;
  const terminal = document.getElementById("terminal");
  terminal.innerHTML = `<p>FINAL DECRYPTION</p><p style="color:#00ff00;">Uifsf jt op gsffepn</p><p>Shift letters back by ONE</p><p id="timer" style="color:red;">Time left: 60 seconds</p><br>`;
  const input = createInput();
  brutalTimer = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = "Time left: " + timeLeft + " seconds";
    if (timeLeft <= 0) { clearInterval(brutalTimer); finalEnding(false); }
  }, 1000);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkPuzzleTwo(input.value);
  });
}

function checkPuzzleTwo(answer) {
  const cleaned = answer.trim().toLowerCase();
  if (cleaned === "there is no freedom") {
    clearInterval(brutalTimer);
    finalEnding(true);
  } else {
    hardGlitch();
  }
}

function finalEnding(success) {
  if (gameLocked) return;
  gameLocked = true;
  clearInterval(brutalTimer);
  const terminal = document.getElementById("terminal");
  if (success) {
    terminal.innerHTML = `<p>Decryption Accepted.</p><p>System logged your profile.</p><br><button onclick="location.reload()" style="background:black;color:#00ff88;border:1px solid #00ff88;padding:8px 16px;cursor:pointer;font-family:monospace;">RESTART</button>`;
  } else {
    hardGlitch();
    terminal.innerHTML = `<p style="color:red;">TIME EXPIRED.</p><p>System dominance confirmed.</p><br><button onclick="location.reload()" style="background:black;color:#00ff88;border:1px solid #00ff88;padding:8px 16px;cursor:pointer;font-family:monospace;">RESTART</button>`;
  }
}

function hardGlitch() {
  let duration = 4000;
  let startTime = Date.now();
  const glitchInterval = setInterval(() => {
    document.body.style.transform = "translate(" + (Math.random()*40 - 20) + "px," + (Math.random()*40 - 20) + "px) rotate(" + (Math.random()*10 - 5) + "deg) scale(" + (1 + Math.random()*0.1) + ")";
    if (Math.random() < 0.4) { document.body.style.background = "#250000"; }
    else { document.body.style.background = ""; }
    if (Date.now() - startTime > duration) {
      clearInterval(glitchInterval);
      document.body.style.transform = "none";
      document.body.style.background = "";
    }
  }, 60);
}

function createInput() {
  const terminal = document.getElementById("terminal");
  const input = document.createElement("input");
  input.type = "text";
  input.style.background = "black";
  input.style.color = "#00ff00";
  input.style.border = "1px solid #00ff00";
  input.style.padding = "5px 8px";
  input.style.outline = "none";
  input.style.fontFamily = "monospace";
  input.style.fontSize = "0.72rem";
  input.style.width = "90%";
  terminal.appendChild(input);
  input.focus();
  return input;
}
