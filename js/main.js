/* ===================================
   RS CONTABILIDADE - MAIN JS
   Lógica principal do site
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initHeader();
    initMobileMenu();
    initFilters();
    initSearch();
    initModal();
    renderPCCards();
    updateStats();
});

/* ===================================
   HEADER
   =================================== */
function initHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ===================================
   MOBILE MENU
   =================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        
        // Fechar menu ao clicar em um link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }
}

/* ===================================
   FILTROS
   =================================== */
let currentFilter = 'all';

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adicionar active ao clicado
            btn.classList.add('active');
            
            currentFilter = btn.dataset.filter;
            filterCards();
        });
    });
}

function filterCards() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const cards = document.querySelectorAll('.pc-card');
    
    cards.forEach(card => {
        const status = card.dataset.status;
        const nome = card.dataset.nome.toLowerCase();
        const usuario = card.dataset.usuario.toLowerCase();
        const setor = card.dataset.setor.toLowerCase();
        
        const matchesFilter = currentFilter === 'all' || status === currentFilter;
        const matchesSearch = nome.includes(searchTerm) || 
                             usuario.includes(searchTerm) || 
                             setor.includes(searchTerm);
        
        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = null;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Verificar se há cards visíveis
    checkEmptyState();
}

function checkEmptyState() {
    const grid = document.getElementById('pcsGrid');
    const visibleCards = grid.querySelectorAll('.pc-card[style*="display: block"], .pc-card:not([style*="display: none"])');
    const emptyState = grid.querySelector('.empty-state');
    
    // Contar cards realmente visíveis
    let visibleCount = 0;
    grid.querySelectorAll('.pc-card').forEach(card => {
        if (card.style.display !== 'none') visibleCount++;
    });
    
    if (visibleCount === 0) {
        if (!emptyState) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Nenhum resultado encontrado</h3>
                <p>Tente ajustar os filtros ou termo de busca</p>
            `;
            grid.appendChild(empty);
        }
    } else {
        if (emptyState) {
            emptyState.remove();
        }
    }
}

/* ===================================
   BUSCA
   =================================== */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        // Debounce para melhor performance
        let timeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                filterCards();
            }, 300);
        });
    }
}

/* ===================================
   RENDERIZAR CARDS
   =================================== */
function renderPCCards() {
    const grid = document.getElementById('pcsGrid');
    if (!grid || !window.pcsData) return;
    
    grid.innerHTML = '';
    
    window.pcsData.forEach(pc => {
        const card = createPCCard(pc);
        grid.appendChild(card);
    });
}

function createPCCard(pc) {
    const card = document.createElement('div');
    card.className = 'pc-card';
    card.dataset.status = pc.status;
    card.dataset.nome = pc.nome;
    card.dataset.usuario = pc.usuario;
    card.dataset.setor = pc.setor;
    card.dataset.pcId = pc.id;
    
    const statusText = {
        'ok': 'Bom Estado',
        'atencao': 'Atenção',
        'critico': 'Crítico'
    };
    
    card.innerHTML = `
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
            <div class="spec-item">
                <i class="fas fa-memory"></i>
                <span class="spec-value"><strong>${pc.specs.ram.total}</strong></span>
            </div>
            <div class="spec-item">
                <i class="fas fa-hdd"></i>
                <span class="spec-value"><strong>${pc.specs.armazenamento.tipo}</strong> ${pc.specs.armazenamento.capacidade}</span>
            </div>
            <div class="spec-item">
                <i class="fas fa-microchip"></i>
                <span class="spec-value"><strong>${pc.specs.processador.modelo}</strong></span>
            </div>
            <div class="spec-item">
                <i class="fas fa-building"></i>
                <span class="spec-value">${pc.setor}</span>
            </div>
        </div>
        <div class="pc-card-footer">
            <span><i class="fas fa-info-circle"></i> Clique para detalhes</span>
            <span class="view-more">
                Ver mais <i class="fas fa-arrow-right"></i>
            </span>
        </div>
    `;
    
    card.addEventListener('click', () => openModal(pc.id));
    
    return card;
}

/* ===================================
   MODAL
   =================================== */
function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(pcId) {
    const pc = window.pcsData.find(p => p.id === pcId);
    if (!pc) return;
    
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('pcModal');
    
    // Preencher dados do modal
    document.getElementById('modalPcName').textContent = pc.nome;
    document.getElementById('modalPcUser').textContent = `Usuário: ${pc.usuario} | Setor: ${pc.setor}`;
    
    const statusText = {
        'ok': 'Bom Estado',
        'atencao': 'Atenção',
        'critico': 'Crítico'
    };
    
    const statusBadge = document.querySelector('#modalStatus .status-badge');
    statusBadge.className = `status-badge ${pc.status}`;
    statusBadge.textContent = statusText[pc.status];
    
    // Preencher especificações
    const specsGrid = document.getElementById('modalSpecs');
    specsGrid.innerHTML = `
        <div class="spec-card">
            <div class="spec-card-header">
                <div class="spec-card-icon">
                    <i class="fas fa-memory"></i>
                </div>
                <span class="spec-card-label">Memória RAM</span>
            </div>
            <div class="spec-card-value">${pc.specs.ram.total}</div>
            <div class="spec-card-detail">${pc.specs.ram.tipo} - ${pc.specs.ram.detalhe}</div>
        </div>
        <div class="spec-card">
            <div class="spec-card-header">
                <div class="spec-card-icon">
                    <i class="fas fa-hdd"></i>
                </div>
                <span class="spec-card-label">Armazenamento</span>
            </div>
            <div class="spec-card-value">${pc.specs.armazenamento.capacidade}</div>
            <div class="spec-card-detail">${pc.specs.armazenamento.tipo} - Usado: ${pc.specs.armazenamento.usado}</div>
        </div>
        <div class="spec-card">
            <div class="spec-card-header">
                <div class="spec-card-icon">
                    <i class="fas fa-microchip"></i>
                </div>
                <span class="spec-card-label">Processador</span>
            </div>
            <div class="spec-card-value">${pc.specs.processador.modelo}</div>
            <div class="spec-card-detail">${pc.specs.processador.geracao} - ${pc.specs.processador.nucleos} @ ${pc.specs.processador.frequencia}</div>
        </div>
        <div class="spec-card">
            <div class="spec-card-header">
                <div class="spec-card-icon">
                    <i class="fab fa-windows"></i>
                </div>
                <span class="spec-card-label">Sistema Operacional</span>
            </div>
            <div class="spec-card-value">${pc.specs.sistemaOperacional}</div>
        </div>
        <div class="spec-card">
            <div class="spec-card-header">
                <div class="spec-card-icon">
                    <i class="fas fa-tv"></i>
                </div>
                <span class="spec-card-label">Placa de Vídeo</span>
            </div>
            <div class="spec-card-value">${pc.specs.gpu}</div>
        </div>
    `;
    
    // Preencher observações
    document.getElementById('modalObservacoes').textContent = pc.observacoes;
    
    // Preencher recomendações
    const recomendacoesList = document.getElementById('modalRecomendacoes');
    recomendacoesList.innerHTML = pc.recomendacoes.map(rec => `<li>${rec}</li>`).join('');
    
    // Preencher links
    const linksGrid = document.getElementById('modalLinks');
    linksGrid.innerHTML = `
        <a href="${pc.links.compraRam}" class="link-card" target="_blank">
            <i class="fas fa-memory"></i>
            <span>Comprar RAM</span>
        </a>
        <a href="${pc.links.compraSSD}" class="link-card" target="_blank">
            <i class="fas fa-hdd"></i>
            <span>Comprar SSD</span>
        </a>
        <a href="${pc.links.compraProcessador}" class="link-card" target="_blank">
            <i class="fas fa-microchip"></i>
            <span>Processador</span>
        </a>
        <a href="${pc.links.relatorio}" class="link-card" target="_blank">
            <i class="fas fa-file-pdf"></i>
            <span>Relatório PDF</span>
        </a>
    `;
    
    // Atualizar links do footer
    document.getElementById('modalRelatorio').href = pc.links.relatorio;
    document.getElementById('modalCompra').href = pc.links.compraSSD;
    
    // Mostrar modal
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ===================================
   ESTATÍSTICAS
   =================================== */
function updateStats() {
    if (!window.pcsData) return;
    
    const total = window.pcsData.length;
    const ok = window.pcsData.filter(pc => pc.status === 'ok').length;
    const atencao = window.pcsData.filter(pc => pc.status === 'atencao' || pc.status === 'critico').length;
    
    // Animar números
    animateCounter('totalPCs', total);
    animateCounter('pcsOk', ok);
    animateCounter('pcsAtencao', atencao);
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (target - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ===================================
   UTILIDADES
   =================================== */
// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
