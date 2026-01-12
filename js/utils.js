/* ===================================
   RS CONTABILIDADE - UTILITÁRIOS
   Funções auxiliares reutilizáveis
   =================================== */

const Utils = {
    // Debounce para otimização de eventos
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para limitar execuções
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Formatar data
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    },

    // Gerar ID único
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    // Copiar para clipboard com feedback
    async copyToClipboard(text, feedbackElement = null) {
        try {
            await navigator.clipboard.writeText(text);
            if (feedbackElement) {
                this.showTooltip(feedbackElement, 'Copiado!');
            }
            return true;
        } catch (err) {
            console.error('Erro ao copiar:', err);
            return false;
        }
    },

    // Mostrar tooltip temporário
    showTooltip(element, message, duration = 2000) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-feedback';
        tooltip.textContent = message;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.cssText = `
            position: fixed;
            top: ${rect.top - 40}px;
            left: ${rect.left + rect.width / 2}px;
            transform: translateX(-50%);
            z-index: 9999;
        `;
        
        document.body.appendChild(tooltip);
        
        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });
        
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }, duration);
    },

    // Verificar se elemento está visível na viewport
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
        );
    },

    // Scroll suave para elemento
    scrollToElement(element, offset = 100) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    },

    // LocalStorage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Erro ao salvar:', e);
                return false;
            }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    },

    // Criar elemento com atributos
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        
        return element;
    }
};

// Exportar para uso global
window.Utils = Utils;
