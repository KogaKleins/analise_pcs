/* ===================================
   SISTEMA DE PARTÍCULAS DINÂMICO
   Adapta-se ao tema atual
   =================================== */

// Configuração de cores por tema
const PARTICLE_THEMES = {
    default: {
        colors: ['#2563EB', '#3B82F6', '#06B6D4', '#22D3EE', '#60A5FA'],
        glowIntensity: 1.5
    },
    'rs-contabilidade': {
        colors: ['#8B0000', '#B22222', '#DC143C', '#FF6B6B', '#D4A373'],
        glowIntensity: 1.8
    }
};

class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        // Determinar tema atual
        const currentTheme = this.getCurrentTheme();
        const themeColors = PARTICLE_THEMES[currentTheme] || PARTICLE_THEMES.default;
        
        this.options = {
            particleCount: options.particleCount || 30,
            colors: themeColors.colors,
            glowIntensity: themeColors.glowIntensity,
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
    
    getCurrentTheme() {
        const html = document.documentElement;
        return html.getAttribute('data-theme') || 'default';
    }
    
    listenThemeChanges() {
        window.addEventListener('themeChanged', (e) => {
            const themeId = e.detail.themeId;
            const themeColors = PARTICLE_THEMES[themeId] || PARTICLE_THEMES.default;
            this.options.colors = themeColors.colors;
            this.options.glowIntensity = themeColors.glowIntensity;
            
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
