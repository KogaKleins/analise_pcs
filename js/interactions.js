/* ===================================
   RS CONTABILIDADE - MICROINTERAÇÕES
   Efeitos e animações interativas
   =================================== */

const Interactions = {
    // Inicializar todas as microinterações
    init() {
        this.initRippleEffect();
        this.initMagneticButtons();
        this.initTiltEffect();
        this.initScrollReveal();
        this.initTypingEffect();
        this.initCounterAnimation();
        this.initProgressBars();
        this.initHoverSounds();
        this.initCursorEffects();
        this.initToastNotifications();
    },

    // Efeito Ripple em botões e cards
    initRippleEffect() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn, .pc-card, .filter-btn, .nav-link');
            if (!target) return;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;

            target.style.position = 'relative';
            target.style.overflow = 'hidden';
            target.appendChild(ripple);

            ripple.addEventListener('animationend', () => ripple.remove());
        });
    },

    // Efeito magnético em botões
    initMagneticButtons() {
        const magneticElements = document.querySelectorAll('.btn-primary, .logo-icon');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    },

    // Efeito 3D Tilt nos cards
    initTiltEffect() {
        const cards = document.querySelectorAll('.pc-card, .stat-item, .product-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    },

    // Scroll Reveal Animation
    initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Adicionar delay escalonado para cards
                    if (entry.target.classList.contains('pc-card')) {
                        const cards = document.querySelectorAll('.pc-card');
                        const index = Array.from(cards).indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.05}s`;
                    }
                }
            });
        }, observerOptions);

        // Observar elementos
        document.querySelectorAll('.pc-card, .section-block, .stat-item, .glass-card').forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
    },

    // Efeito de digitação
    initTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(el => {
            const text = el.textContent;
            const speed = parseInt(el.dataset.typingSpeed) || 50;
            
            el.textContent = '';
            el.style.visibility = 'visible';
            
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            };
            
            // Iniciar quando visível
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
            observer.observe(el);
        });
    },

    // Animação de contadores
    initCounterAnimation() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const animateCounter = (el) => {
            const target = parseInt(el.dataset.counter);
            const duration = parseInt(el.dataset.duration) || 2000;
            const start = 0;
            const startTime = performance.now();
            
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(start + (target - start) * easeOutQuart);
                
                el.textContent = current.toLocaleString('pt-BR');
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            
            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    },

    // Barras de progresso animadas
    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.dataset.progress || '0';
                    entry.target.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        });

        progressBars.forEach(bar => observer.observe(bar));
    },

    // Sons sutis em hover (opcional)
    initHoverSounds() {
        // Desabilitado por padrão - pode ser habilitado pelo usuário
        if (!Utils.storage.get('soundEnabled', false)) return;

        const hoverSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        hoverSound.volume = 0.1;

        document.querySelectorAll('.btn, .pc-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {});
            });
        });
    },

    // Efeito de cursor personalizado
    initCursorEffects() {
        // Criar cursor personalizado
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Animação suave do ring
        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            
            requestAnimationFrame(animateRing);
        };
        animateRing();

        // Efeito hover em elementos interativos
        document.querySelectorAll('a, button, .pc-card, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });

        // Esconder cursor em mobile
        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
        }
    },

    // Sistema de notificações Toast
    initToastNotifications() {
        // Criar container de toasts
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    },

    // Mostrar toast
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        const autoRemove = setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeToast(toast);
        });
    },

    removeToast(toast) {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    },

    // Efeito de shake para erros
    shake(element) {
        element.classList.add('shake');
        element.addEventListener('animationend', () => {
            element.classList.remove('shake');
        }, { once: true });
    },

    // Efeito de pulse para destacar
    pulse(element) {
        element.classList.add('pulse-once');
        element.addEventListener('animationend', () => {
            element.classList.remove('pulse-once');
        }, { once: true });
    },

    // Efeito de confetti para sucesso - Usa cores dinâmicas do tema
    confetti(x, y) {
        // Obter cores do tema atual
        const style = getComputedStyle(document.documentElement);
        const primary = style.getPropertyValue('--primary').trim() || '#2563EB';
        const primaryLight = style.getPropertyValue('--primary-light').trim() || '#3B82F6';
        const accent = style.getPropertyValue('--accent').trim() || '#06B6D4';
        const accentLight = style.getPropertyValue('--accent-light').trim() || '#22D3EE';
        
        const colors = [primary, primaryLight, accent, accentLight, '#FFD700'];
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                --tx: ${(Math.random() - 0.5) * 200}px;
                --ty: ${Math.random() * -200 - 50}px;
                --r: ${Math.random() * 720}deg;
            `;
            document.body.appendChild(particle);
            
            particle.addEventListener('animationend', () => particle.remove());
        }
    }
};

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    Interactions.init();
});

// Exportar para uso global
window.Interactions = Interactions;
