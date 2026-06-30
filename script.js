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

// Cyber Terminal
class CyberTerminal {
    constructor() {
        this.commands = [
            'hack_mainframe',
            'decrypt_data',
            'scan_network',
            'inject_payload',
            'bypass_firewall',
            'trace_connection',
            'execute_protocol',
            'analyze_traffic'
        ];
        this.currentCommandIndex = 0;
        this.matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.init();
    }

    init() {
        this.startTypingAnimation();
        this.createMatrixRain();
        this.addTerminalInteractivity();
        this.startSystemAnimations();
        this.addGlitchEffects();
    }

    startTypingAnimation() {
        const typingElement = document.getElementById('typing-command');
        if(!typingElement)return;
        let charIndex = 0;
        let currentCommand = this.commands[this.currentCommandIndex];

        const typeChar = () => {
            if (charIndex < currentCommand.length) {
                typingElement.textContent = currentCommand.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeChar, 100 + Math.random() * 100);
            } else {
                setTimeout(() => {
                    this.executeCommand(currentCommand);
                    this.nextCommand();
                }, 2000);
            }
        };
        typeChar();
    }

    nextCommand() {
        this.currentCommandIndex = (this.currentCommandIndex + 1) % this.commands.length;
        const typingElement = document.getElementById('typing-command');
        if(!typingElement)return;
        let currentText = typingElement.textContent;
        const backspace = () => {
            if (currentText.length > 0) {
                currentText = currentText.substring(0, currentText.length - 1);
                typingElement.textContent = currentText;
                setTimeout(backspace, 50);
            } else {
                setTimeout(() => this.startTypingAnimation(), 500);
            }
        };
        setTimeout(backspace, 1000);
    }

    executeCommand(command) {
        const terminalContent = document.getElementById('terminal-content');
        if(!terminalContent)return;
        const output = document.createElement('div');
        output.className = 'output';
        
        const responses = {
            'hack_mainframe': '<span class="success">✓ Mainframe access granted</span>',
            'decrypt_data': '<span class="info">► Decryption complete: 2,847 files</span>',
            'scan_network': '<span class="warning">⚠ 12 vulnerable nodes detected</span>',
            'inject_payload': '<span class="success">✓ Payload injected successfully</span>',
            'bypass_firewall': '<span class="info">► Firewall bypassed via port 8080</span>',
            'trace_connection': '<span class="warning">⚠ Connection traced to 192.168.1.42</span>',
            'execute_protocol': '<span class="success">✓ Protocol executed: CIPHER-2048</span>',
            'analyze_traffic': '<span class="info">► Traffic analysis: 99.7% encrypted</span>'
        };

        output.innerHTML = responses[command] || '<span class="error">✗ Command not found</span>';
        terminalContent.appendChild(output);
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    createMatrixRain() {
        const matrixDisplay = document.getElementById('matrix-display');
        if(!matrixDisplay)return;
        setInterval(() => {
            this.addMatrixColumn(matrixDisplay);
        }, 150);
    }

    addMatrixColumn(container) {
        const column = document.createElement('div');
        column.style.cssText = `
            position:absolute;left:${Math.random()*100}%;top:-20px;color:#00ff41;
            font-size:10px;line-height:12px;animation:matrixRain 3s linear forwards;
            opacity:.7;text-shadow:0 0 5px rgba(0,255,65,.8);
        `;
        let matrixString = '';
        for (let i = 0; i < 6; i++) {
            matrixString += this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)] + '<br>';
        }
        column.innerHTML = matrixString;
        container.appendChild(column);
        setTimeout(() => { if(column.parentNode) column.parentNode.removeChild(column); }, 3000);
    }

    addTerminalInteractivity() {
        const terminal = document.querySelector('.terminal-container');
        if(!terminal)return;
        
        terminal.addEventListener('click', (e) => this.createRipple(e));

        const controls = document.querySelectorAll('.control');
        controls.forEach((control, index) => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleControlClick(control, index);
            });
        });

        document.querySelectorAll('.stat-item').forEach(item => {
            item.addEventListener('mouseenter', () => this.addStatHoverEffect(item));
        });
    }

    createRipple(e) {
        const terminal = document.querySelector('.terminal-container');
        if(!terminal)return;
        const rect = terminal.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = 60;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = `
            position:absolute;width:${size}px;height:${size}px;
            background:radial-gradient(circle,rgba(0,255,65,.3) 0%,transparent 70%);
            border-radius:50%;left:${x}px;top:${y}px;pointer-events:none;
            animation:rippleExpand .6s ease-out forwards;z-index:10;
        `;
        terminal.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    handleControlClick(control, index) {
        const terminal = document.querySelector('.terminal-container');
        if(!terminal)return;
        switch(index) {
            case 0:
                this.addGlitchEffect(terminal);
                setTimeout(() => { terminal.style.opacity = '0'; terminal.style.transform = 'scale(0.8)'; }, 200);
                setTimeout(() => { terminal.style.opacity = '1'; terminal.style.transform = 'scale(1)'; }, 1500);
                break;
            case 1:
                terminal.style.transform = 'scaleY(0.1)';
                setTimeout(() => { terminal.style.transform = 'scaleY(1)'; }, 800);
                break;
            case 2:
                terminal.classList.toggle('maximized');
                break;
        }
    }

    addStatHoverEffect(item) {
        const value = item.querySelector('.stat-value');
        if(!value)return;
        const label = item.querySelector('.stat-label').textContent;
        let newValue;
        switch(label) {
            case 'CPU': newValue = Math.floor(Math.random() * 30 + 15) + '%'; break;
            case 'RAM': newValue = Math.floor(Math.random() * 40 + 50) + '%'; break;
            case 'NET': newValue = Math.floor(Math.random() * 500 + 400) + ' MB/s'; break;
            case 'SEC': newValue = 'SECURE'; break;
            default: newValue = value.textContent;
        }
        let flickerCount = 0;
        const flicker = setInterval(() => {
            value.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
            value.textContent = Math.random() > 0.5 ? newValue : '???';
            flickerCount++;
            if (flickerCount > 10) {
                clearInterval(flicker);
                value.style.opacity = '1';
                value.textContent = newValue;
            }
        }, 100);
    }

    startSystemAnimations() {
        setInterval(() => {
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            if (progressFill && progressText) {
                const newWidth = Math.floor(Math.random() * 30 + 70);
                progressFill.style.width = newWidth + '%';
                progressText.textContent = `SCANNING... ${newWidth}%`;
            }
        }, 3000);

        const statusIndicator = document.querySelector('.status-indicator');
        if(statusIndicator) {
            setInterval(() => {
                statusIndicator.style.transform = 'scale(1.5)';
                setTimeout(() => { statusIndicator.style.transform = 'scale(1)'; }, 200);
            }, 2000);
        }
    }

    addGlitchEffects() {
        setInterval(() => { if (Math.random() < 0.1) this.triggerScreenGlitch(); }, 5000);
        setInterval(() => this.corruptRandomText(), 8000);
    }

    addGlitchEffect(element) {
        element.style.animation = 'none';
        element.offsetHeight;
        element.style.animation = 'glitchEffect .3s ease-in-out';
    }

    triggerScreenGlitch() {
        const terminal = document.querySelector('.terminal-container');
        if(!terminal)return;
        this.addGlitchEffect(terminal);
        setTimeout(() => {
            terminal.style.filter = 'invert(1) hue-rotate(180deg)';
            setTimeout(() => { terminal.style.filter = 'none'; }, 100);
        }, 150);
    }

    corruptRandomText() {
        const textElements = document.querySelectorAll('.output, .command, .stat-value');
        if (textElements.length === 0) return;
        const randomElement = textElements[Math.floor(Math.random() * textElements.length)];
        const originalText = randomElement.textContent;
        if (!originalText || originalText.length < 3) return;
        let corruptedText = originalText;
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * corruptedText.length);
            const randomChar = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            corruptedText = corruptedText.substring(0, randomIndex) + randomChar + corruptedText.substring(randomIndex + 1);
        }
        randomElement.textContent = corruptedText;
        randomElement.style.color = '#ff3b30';
        setTimeout(() => {
            randomElement.textContent = originalText;
            randomElement.style.color = '';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CyberTerminal();
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-out';
        document.body.style.opacity = '1';
    }, 100);
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        const terminal = document.querySelector('.terminal-container');
        if (terminal) terminal.style.animation = 'glitchEffect .3s ease-in-out';
    }
});
