/* ===================================
   RS CONTABILIDADE - PARTÍCULAS
   Efeito de partículas no fundo
   =================================== */

class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.options = {
            particleCount: options.particleCount || 30,
            colors: options.colors || ['#8B0000', '#B22222', '#DC143C'],
            minSize: options.minSize || 2,
            maxSize: options.maxSize || 6,
            minDuration: options.minDuration || 15,
            maxDuration: options.maxDuration || 30,
            ...options
        };
        
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.options.particleCount; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamanho aleatório
        const size = this.randomBetween(this.options.minSize, this.options.maxSize);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Cor aleatória
        const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        // Posição inicial aleatória
        particle.style.left = `${this.randomBetween(0, 100)}%`;
        particle.style.bottom = `-${size}px`;
        
        // Duração aleatória
        const duration = this.randomBetween(this.options.minDuration, this.options.maxDuration);
        particle.style.animationDuration = `${duration}s`;
        
        // Delay aleatório
        particle.style.animationDelay = `${this.randomBetween(0, 5)}s`;
        
        this.container.appendChild(particle);
        
        // Recriar partícula quando animação terminar
        particle.addEventListener('animationiteration', () => {
            particle.style.left = `${this.randomBetween(0, 100)}%`;
        });
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// Inicializar sistema de partículas quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particles', {
        particleCount: 25,
        colors: ['#8B0000', '#B22222', '#DC143C', '#FF6B6B'],
        minSize: 2,
        maxSize: 5,
        minDuration: 20,
        maxDuration: 40
    });
});
