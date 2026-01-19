/* ===================================
   SISTEMA DE PARTÍCULAS DINÂMICO
   Adapta-se ao tema atual via CSS Variables
   =================================== */

// Função para obter cores do tema atual via CSS
function getThemeColors() {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--primary').trim() || '#2563EB';
    const primaryLight = style.getPropertyValue('--primary-light').trim() || '#3B82F6';
    const accent = style.getPropertyValue('--accent').trim() || '#06B6D4';
    const accentLight = style.getPropertyValue('--accent-light').trim() || '#22D3EE';
    
    return [primary, primaryLight, accent, accentLight, primaryLight];
}

class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        // Usar cores dinâmicas do CSS
        this.options = {
            particleCount: options.particleCount || 30,
            colors: getThemeColors(),
            glowIntensity: 1.5,
            minSize: options.minSize || 2,
            maxSize: options.maxSize || 6,
            minDuration: options.minDuration || 15,
            maxDuration: options.maxDuration || 30,
            ...options
        };
        
        this.particles = [];
        this.init();
        
        // Escutar mudanças de tema
        this.listenThemeChanges();
    }
    
    listenThemeChanges() {
        window.addEventListener('themeChanged', () => {
            // Atualizar cores do tema
            this.options.colors = getThemeColors();
            
            // Atualizar cores das partículas existentes
            this.updateParticleColors();
        });
    }
    
    updateParticleColors() {
        this.particles.forEach(particle => {
            const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
            const size = parseFloat(particle.style.width);
            particle.style.background = color;
            particle.style.boxShadow = `0 0 ${size * this.options.glowIntensity * 2}px ${color}`;
        });
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
        particle.style.boxShadow = `0 0 ${size * this.options.glowIntensity * 2}px ${color}`;
        
        // Posição inicial aleatória
        particle.style.left = `${this.randomBetween(0, 100)}%`;
        particle.style.bottom = `-${size}px`;
        
        // Duração aleatória
        const duration = this.randomBetween(this.options.minDuration, this.options.maxDuration);
        particle.style.animationDuration = `${duration}s`;
        
        // Delay aleatório
        particle.style.animationDelay = `${this.randomBetween(0, 5)}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Recriar partícula quando animação terminar
        particle.addEventListener('animationiteration', () => {
            particle.style.left = `${this.randomBetween(0, 100)}%`;
            // Atualizar cor também
            const newColor = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
            particle.style.background = newColor;
            particle.style.boxShadow = `0 0 ${size * this.options.glowIntensity * 2}px ${newColor}`;
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
        minSize: 2,
        maxSize: 5,
        minDuration: 20,
        maxDuration: 40
    });
});
