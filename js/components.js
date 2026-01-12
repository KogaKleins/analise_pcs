/* ===================================
   RS CONTABILIDADE - COMPONENTES JS
   Modal, Cards, Filtros modulares
   =================================== */

// ===================================
// COMPONENTE: Modal
// ===================================
class Modal {
    constructor(options = {}) {
        this.overlay = document.getElementById(options.overlayId || 'modalOverlay');
        this.modal = document.getElementById(options.modalId || 'pcModal');
        this.closeBtn = document.getElementById(options.closeId || 'modalClose');
        this.onOpen = options.onOpen || null;
        this.onClose = options.onClose || null;
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (!this.overlay || !this.modal) return;

        // Fechar ao clicar no overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Fechar com botão
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Trap focus dentro do modal
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }

    open(data = null) {
        if (this.onOpen && data) {
            this.onOpen(data);
        }

        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;

        // Focus no modal para acessibilidade
        this.modal.setAttribute('aria-hidden', 'false');
        this.closeBtn?.focus();

        // Animação de entrada
        this.modal.style.animation = 'modalSlideIn 0.4s ease forwards';
    }

    close() {
        // Animação de saída
        this.modal.style.animation = 'modalSlideOut 0.3s ease forwards';
        
        setTimeout(() => {
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
            this.isOpen = false;
            this.modal.setAttribute('aria-hidden', 'true');
            
            if (this.onClose) {
                this.onClose();
            }
        }, 300);
    }

    trapFocus(e) {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }

    setContent(contentHtml) {
        const body = this.modal.querySelector('.modal-body');
        if (body) {
            body.innerHTML = contentHtml;
        }
    }
}

// ===================================
// COMPONENTE: CardGrid
// ===================================
class CardGrid {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.data = options.data || [];
        this.onCardClick = options.onCardClick || null;
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.sortBy = options.sortBy || 'id';
        this.sortOrder = options.sortOrder || 'asc';
    }

    render() {
        if (!this.container) return;
        
        const filteredData = this.getFilteredData();
        
        if (filteredData.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.container.innerHTML = '';
        
        filteredData.forEach((item, index) => {
            const card = this.createCard(item, index);
            this.container.appendChild(card);
        });

        // Re-inicializar efeitos de tilt
        if (window.Interactions) {
            window.Interactions.initTiltEffect();
        }
    }

    createCard(pc, index) {
        const statusText = {
            'ok': 'Bom Estado',
            'atencao': 'Atenção',
            'critico': 'Crítico'
        };

        const card = document.createElement('div');
        card.className = 'pc-card reveal-element';
        card.dataset.status = pc.status;
        card.dataset.nome = pc.nome;
        card.dataset.usuario = pc.usuario;
        card.dataset.setor = pc.setor;
        card.dataset.pcId = pc.id;
        card.style.animationDelay = `${index * 0.05}s`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Ver detalhes do ${pc.nome}`);

        card.innerHTML = `
            <div class="card-glow"></div>
            <div class="pc-card-header">
                <div class="pc-icon">
                    <i class="fas fa-desktop"></i>
                </div>
                <div class="pc-info">
                    <h3 class="pc-name">${pc.nome}</h3>
                    <span class="pc-user">
                        <i class="fas fa-user"></i>
                        ${pc.usuario}
                    </span>
                </div>
                <span class="status-badge ${pc.status}">${statusText[pc.status]}</span>
            </div>
            <div class="pc-specs-preview">
                <div class="spec-item" data-tooltip="Memória RAM">
                    <i class="fas fa-memory"></i>
                    <span class="spec-value"><strong>${pc.specs.ram.total}</strong></span>
                </div>
                <div class="spec-item" data-tooltip="Armazenamento">
                    <i class="fas fa-hdd"></i>
                    <span class="spec-value"><strong>${pc.specs.armazenamento.tipo}</strong> ${pc.specs.armazenamento.capacidade}</span>
                </div>
                <div class="spec-item" data-tooltip="Processador">
                    <i class="fas fa-microchip"></i>
                    <span class="spec-value"><strong>${pc.specs.processador.modelo}</strong></span>
                </div>
                <div class="spec-item" data-tooltip="Setor">
                    <i class="fas fa-building"></i>
                    <span class="spec-value">${pc.setor}</span>
                </div>
            </div>
            <div class="pc-card-footer">
                <span class="click-hint"><i class="fas fa-hand-pointer"></i> Clique para detalhes</span>
                <span class="view-more">
                    Ver mais <i class="fas fa-arrow-right"></i>
                </span>
            </div>
        `;

        // Event listeners
        card.addEventListener('click', () => {
            if (this.onCardClick) {
                this.onCardClick(pc.id);
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (this.onCardClick) {
                    this.onCardClick(pc.id);
                }
            }
        });

        // Efeito de hover glow
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        return card;
    }

    renderEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Nenhum resultado encontrado</h3>
                <p>Tente ajustar os filtros ou termo de busca</p>
                <button class="btn btn-secondary" onclick="window.cardGrid.resetFilters()">
                    <i class="fas fa-undo"></i> Limpar filtros
                </button>
            </div>
        `;
    }

    getFilteredData() {
        let filtered = [...this.data];

        // Filtro por status
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(pc => pc.status === this.currentFilter);
        }

        // Filtro por busca
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(pc => 
                pc.nome.toLowerCase().includes(term) ||
                pc.usuario.toLowerCase().includes(term) ||
                pc.setor.toLowerCase().includes(term)
            );
        }

        // Ordenação
        filtered.sort((a, b) => {
            let valueA = a[this.sortBy];
            let valueB = b[this.sortBy];

            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        return filtered;
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
        this.updateStats();
    }

    setSearch(term) {
        this.searchTerm = term;
        this.render();
    }

    setSort(sortBy, sortOrder = 'asc') {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.render();
    }

    resetFilters() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        // Reset UI
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.render();
    }

    updateStats() {
        const filtered = this.getFilteredData();
        const total = this.data.length;
        const ok = this.data.filter(pc => pc.status === 'ok').length;
        const atencao = this.data.filter(pc => pc.status === 'atencao' || pc.status === 'critico').length;

        this.animateCounter('totalPCs', total);
        this.animateCounter('pcsOk', ok);
        this.animateCounter('pcsAtencao', atencao);
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 1000;
        const start = parseInt(element.textContent) || 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (target - start) * easeOutQuart);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// ===================================
// COMPONENTE: FilterBar
// ===================================
class FilterBar {
    constructor(options = {}) {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.searchInput = document.getElementById(options.searchInputId || 'searchInput');
        this.onFilterChange = options.onFilterChange || null;
        this.onSearchChange = options.onSearchChange || null;
        
        this.init();
    }

    init() {
        // Filtros
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (this.onFilterChange) {
                    this.onFilterChange(btn.dataset.filter);
                }

                // Feedback visual
                if (window.Interactions) {
                    window.Interactions.pulse(btn);
                }
            });
        });

        // Busca com debounce
        if (this.searchInput) {
            const debouncedSearch = Utils.debounce((value) => {
                if (this.onSearchChange) {
                    this.onSearchChange(value);
                }
            }, 300);

            this.searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });

            // Clear button
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.searchInput.value = '';
                    debouncedSearch('');
                }
            });
        }
    }

    reset() {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });
        
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
}

// ===================================
// COMPONENTE: Header
// ===================================
class Header {
    constructor() {
        this.header = document.querySelector('.header');
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.lastScroll = 0;
        
        this.init();
    }

    init() {
        // Scroll behavior
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 100));

        // Mobile menu
        if (this.menuToggle && this.navMenu) {
            this.menuToggle.addEventListener('click', () => {
                this.toggleMenu();
            });

            // Fechar ao clicar em link
            this.navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (!this.header.contains(e.target) && this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            });
        }
    }

    handleScroll() {
        const currentScroll = window.scrollY;

        // Adicionar classe scrolled
        if (currentScroll > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentScroll > this.lastScroll && currentScroll > 200) {
            this.header.classList.add('header-hidden');
        } else {
            this.header.classList.remove('header-hidden');
        }

        this.lastScroll = currentScroll;
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        const icon = this.menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Prevent body scroll when menu open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        const icon = this.menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
        document.body.style.overflow = '';
    }
}

// ===================================
// COMPONENTE: ThemeSwitcher (bônus)
// ===================================
class ThemeSwitcher {
    constructor() {
        this.currentTheme = Utils.storage.get('theme', 'dark');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        Utils.storage.set('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Exportar componentes
window.Modal = Modal;
window.CardGrid = CardGrid;
window.FilterBar = FilterBar;
window.Header = Header;
window.ThemeSwitcher = ThemeSwitcher;
