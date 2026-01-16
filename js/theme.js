/**
 * ========================================
 * THEME.JS - Sistema de Temas Dinâmico
 * RS Contabilidade - Análise de Equipamentos
 * ========================================
 * Tema Padrão: Azul Glass (moderno e profissional)
 * Tema RS: Vermelho Bordô (cliente RS Contabilidade)
 * ========================================
 */

// Configuração de temas disponíveis
const THEMES_CONFIG = {
    default: {
        id: 'default',
        name: 'Azul Glass',
        dataTheme: null, // Usa as variáveis padrão do :root
        description: 'Tema moderno azul com efeito glass',
        brandName: 'SISTEMA DE ANÁLISE',
        brandSubtitle: 'Gerenciamento de Equipamentos'
    },
    'rs-contabilidade': {
        id: 'rs-contabilidade',
        name: 'RS Contabilidade',
        dataTheme: 'rs-contabilidade',
        description: 'Tema exclusivo vermelho bordô',
        brandName: 'RS CONTABILIDADE',
        brandSubtitle: 'Análise de Equipamentos'
    }
};

// Mapeamento de usuários para temas
const USER_THEMES = {
    'RS contabilidade': 'rs-contabilidade',
    'RS Contabilidade': 'rs-contabilidade'
    // Outros usuários usarão o tema padrão
};

// Classe principal do sistema de temas
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.transitionDuration = 500; // ms
        this.init();
    }

    init() {
        // Verificar tema salvo ou determinar pelo usuário logado
        this.loadTheme();
        
        // Criar elementos de background se não existirem
        this.createBackgroundElements();
        
        // Inicializar luzes ambiente
        this.initAmbientLights();
        
        // Adicionar listener para mudanças de sessão
        this.watchSessionChanges();
    }

    // Carregar tema baseado na sessão do usuário
    loadTheme() {
        const session = this.getSession();
        
        if (session && session.username) {
            // Verificar se o usuário tem um tema específico
            const userTheme = USER_THEMES[session.username];
            if (userTheme) {
                this.setTheme(userTheme, false);
                return;
            }
        }
        
        // Usar tema padrão
        this.setTheme('default', false);
    }

    // Obter sessão do localStorage
    getSession() {
        try {
            const session = localStorage.getItem('rs_session');
            return session ? JSON.parse(session) : null;
        } catch (e) {
            return null;
        }
    }

    // Definir tema ativo
    setTheme(themeId, animate = true) {
        const theme = THEMES_CONFIG[themeId] || THEMES_CONFIG.default;
        const html = document.documentElement;
        const body = document.body;

        // Adicionar classe de transição se animação habilitada
        if (animate) {
            body.classList.add('theme-transition');
        }

        // Remover tema anterior
        html.removeAttribute('data-theme');
        
        // Aplicar novo tema
        if (theme.dataTheme) {
            html.setAttribute('data-theme', theme.dataTheme);
        }

        this.currentTheme = themeId;
        
        // Salvar preferência
        localStorage.setItem('rs_theme', themeId);

        // Atualizar meta theme-color
        this.updateMetaThemeColor(themeId);

        // Remover classe de transição após animação
        if (animate) {
            setTimeout(() => {
                body.classList.remove('theme-transition');
            }, this.transitionDuration);
        }

        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme, themeId: themeId } 
        }));

        // Atualizar branding
        this.updateBranding(theme);

        // Mostrar indicador de tema (opcional)
        this.showThemeIndicator(theme);
    }

    // Atualizar branding (nome da empresa, etc)
    updateBranding(theme) {
        const brandName = document.getElementById('brandName');
        if (brandName && theme.brandName) {
            brandName.textContent = theme.brandName;
        }
        
        // Atualizar título da página
        if (theme.brandName) {
            const currentTitle = document.title;
            if (theme.id === 'rs-contabilidade') {
                document.title = currentTitle.replace('Sistema de Análise', 'RS Contabilidade');
            } else {
                document.title = currentTitle.replace('RS Contabilidade', 'Sistema de Análise');
            }
        }
    }

    // Atualizar cor do tema no meta tag
    updateMetaThemeColor(themeId) {
        let color = '#2563EB'; // Azul padrão
        
        if (themeId === 'rs-contabilidade') {
            color = '#8B0000'; // Vermelho bordô
        }
        
        let meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', color);
        }
    }

    // Criar elementos de background
    createBackgroundElements() {
        // Verificar se já existem
        if (document.querySelector('.bg-image-layer')) return;

        // Criar layer de imagem de fundo
        const bgLayer = document.createElement('div');
        bgLayer.className = 'bg-image-layer';
        document.body.insertBefore(bgLayer, document.body.firstChild);
    }

    // Inicializar luzes ambiente
    initAmbientLights() {
        // Verificar se já existem
        if (document.querySelector('.ambient-light')) return;

        // Criar luzes ambiente
        const lightTopLeft = document.createElement('div');
        lightTopLeft.className = 'ambient-light top-left';
        
        const lightBottomRight = document.createElement('div');
        lightBottomRight.className = 'ambient-light bottom-right';

        document.body.appendChild(lightTopLeft);
        document.body.appendChild(lightBottomRight);
    }

    // Mostrar indicador de tema (feedback visual temporário)
    showThemeIndicator(theme) {
        // Remover indicador existente
        const existing = document.querySelector('.theme-indicator');
        if (existing) {
            existing.remove();
        }

        // Criar novo indicador
        const indicator = document.createElement('div');
        indicator.className = 'theme-indicator';
        indicator.setAttribute('role', 'status');
        indicator.setAttribute('aria-live', 'polite');
        indicator.innerHTML = `
            <span class="theme-dot"></span>
            <span>Tema: ${theme.name}</span>
        `;
        document.body.appendChild(indicator);

        // Mostrar com animação
        requestAnimationFrame(() => {
            indicator.classList.add('show');
        });

        // Remover após alguns segundos
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => indicator.remove(), 300);
        }, 2000);
    }

    // Monitorar mudanças na sessão
    watchSessionChanges() {
        // Usar MutationObserver para melhor performance (ao invés de setInterval)
        // Também verificar mudanças no storage
        window.addEventListener('storage', (e) => {
            if (e.key === 'rs_session') {
                this.loadTheme();
            }
        });
        
        // Fallback com intervalo mais longo para outras mudanças
        setInterval(() => {
            const session = this.getSession();
            const expectedTheme = session && session.username && USER_THEMES[session.username] 
                ? USER_THEMES[session.username] 
                : 'default';
            
            if (this.currentTheme !== expectedTheme) {
                this.loadTheme();
            }
        }, 2000); // Reduzido para 2 segundos
    }

    // Alternar entre temas (para botão de toggle, se necessário)
    toggleTheme() {
        const themes = Object.keys(THEMES_CONFIG);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    // Obter tema atual
    getCurrentTheme() {
        return THEMES_CONFIG[this.currentTheme] || THEMES_CONFIG.default;
    }

    // Verificar se está usando tema específico
    isTheme(themeId) {
        return this.currentTheme === themeId;
    }

    // Verificar se é tema RS
    isRSTheme() {
        return this.currentTheme === 'rs-contabilidade';
    }

    // Definir tema para usuário logado
    setThemeForUser(username) {
        const userTheme = USER_THEMES[username];
        if (userTheme) {
            this.setTheme(userTheme);
        } else {
            this.setTheme('default');
        }
    }
    
    // Destruir instância e limpar recursos
    destroy() {
        // Remover elementos criados
        const bgLayer = document.querySelector('.bg-image-layer');
        if (bgLayer) bgLayer.remove();
        
        const lights = document.querySelectorAll('.ambient-light');
        lights.forEach(l => l.remove());
        
        const indicator = document.querySelector('.theme-indicator');
        if (indicator) indicator.remove();
    }
}

// Instância global do gerenciador de temas
let themeManager = null;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    if (themeManager) {
        themeManager.destroy();
    }
});

// Exportar para uso em outros scripts
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
    window.getThemeManager = () => themeManager;
    window.THEMES_CONFIG = THEMES_CONFIG;
}

// Função auxiliar para definir tema externamente
function setAppTheme(themeId) {
    if (themeManager) {
        themeManager.setTheme(themeId);
    }
}

// Função auxiliar para definir tema baseado no usuário
function setThemeForUser(username) {
    if (themeManager) {
        themeManager.setThemeForUser(username);
    }
}
