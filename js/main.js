/* 问渠 - 共享JavaScript */

// 粒子动画系统
class ParticleSystem {
  constructor(canvasId = 'particleCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 60;
    this.maxDist = 150;
    this.mouse = { x: null, y: null };
    
    this.init();
    this.animate();
    this.setupEvents();
  }
  
  init() {
    this.resize();
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  setupEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, i) => {
      // 更新位置
      p.x += p.vx;
      p.y += p.vy;
      
      // 边界检测
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      // 绘制粒子
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
      this.ctx.fill();
      
      // 连接线
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.maxDist) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - dist / this.maxDist)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
      
      // 鼠标交互
      if (this.mouse.x && this.mouse.y) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.maxDist * 1.5) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * (1 - dist / (this.maxDist * 1.5))})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Modal系统
class ModalManager {
  constructor() {
    this.overlay = document.getElementById('modal');
    this.titleEl = document.getElementById('modalTitle');
    this.bodyEl = document.getElementById('modalBody');
    this.closeBtn = document.getElementById('modalCloseBtn');
    
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }
  
  open(title, body) {
    if (this.titleEl) this.titleEl.innerHTML = title;
    if (this.bodyEl) this.bodyEl.innerHTML = body;
    if (this.overlay) {
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// 导航交互
function initNavigation() {
  const cards = document.querySelectorAll('.category-card, .tool-card, .hero-card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    });
  });
}

// 数字格式化
function formatNumber(n) {
  if (n === 0) return '0';
  if (Math.abs(n) >= 1e9) return n.toExponential(4);
  if (Math.abs(n) >= 1000) return n.toLocaleString('zh', { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 1) return parseFloat(n.toFixed(6)).toString();
  if (Math.abs(n) >= 0.001) return parseFloat(n.toFixed(6)).toString();
  return n.toExponential(4);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 粒子系统
  if (document.getElementById('particleCanvas')) {
    window.particleSystem = new ParticleSystem();
  }
  
  // Modal管理
  window.modalManager = new ModalManager();
  
  // 导航
  initNavigation();
});

// 导出到全局
window.ParticleSystem = ParticleSystem;
window.ModalManager = ModalManager;
window.formatNumber = formatNumber;
