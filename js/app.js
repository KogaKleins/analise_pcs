/* ===================================
   RS CONTABILIDADE - MAIN JS
   Lógica principal do site (Refatorado)
   =================================== */

// Instâncias globais dos componentes
let header, filterBar, cardGrid, pcModal;

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Mostrar loading
        showLoadingState();

        // Aguardar dados carregarem
        await waitForData();

        // Inicializar componentes
        initHeader();
        initCardGrid();
        initFilterBar();
        initModal();
        
        // Inicializar funcionalidades extras
        initKeyboardShortcuts();
        initSmoothScroll();
        initLazyLoading();

        // Remover loading
        hideLoadingState();

        // Mostrar toast de boas-vindas
        setTimeout(() => {
            if (window.Interactions) {
                Interactions.showToast('Bem-vindo à RS Contabilidade!', 'success', 3000);
            }
        }, 1000);

    } catch (error) {
        console.error('Erro ao inicializar:', error);
        showErrorState();
    }
}

// ===================================
// LOADING STATE
// ===================================
function showLoadingState() {
    const grid = document.getElementById('pcsGrid');
    if (!grid) return;

    // Criar skeleton cards
    grid.innerHTML = Array(6).fill('').map(() => `
        <div class="skeleton-card">
            <div style="display: flex; gap: 16px; margin-bottom: 20px;">
                <div class="skeleton-circle"></div>
                <div style="flex: 1;">
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line" style="width: 40%; height: 12px;"></div>
                </div>
            </div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line short"></div>
        </div>
    `).join('');
}

function hideLoadingState() {
    // O grid será substituído pelo render dos cards
}

function showErrorState() {
    const grid = document.getElementById('pcsGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Erro ao carregar dados</h3>
            <p>Tente recarregar a página</p>
            <button class="btn btn-primary" onclick="location.reload()">
                <i class="fas fa-redo"></i> Recarregar
            </button>
        </div>
    `;
}

function waitForData() {
    return new Promise((resolve, reject) => {
        if (window.pcsData) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 50;
        
        const checkData = setInterval(() => {
            attempts++;
            if (window.pcsData) {
                clearInterval(checkData);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkData);
                reject(new Error('Timeout ao carregar dados'));
            }
        }, 100);
    });
}

// ===================================
// COMPONENTES
// ===================================
function initHeader() {
    header = new Header();
}

function initCardGrid() {
    cardGrid = new CardGrid('pcsGrid', {
        data: window.pcsData,
        onCardClick: (pcId) => openPCModal(pcId)
    });

    cardGrid.render();
    cardGrid.updateStats();

    // Exportar para uso global
    window.cardGrid = cardGrid;
}

function initFilterBar() {
    filterBar = new FilterBar({
        searchInputId: 'searchInput',
        onFilterChange: (filter) => {
            cardGrid.setFilter(filter);
        },
        onSearchChange: (term) => {
            cardGrid.setSearch(term);
        }
    });
}

function initModal() {
    pcModal = new Modal({
        overlayId: 'modalOverlay',
        modalId: 'pcModal',
        closeId: 'modalClose',
        onOpen: (pcId) => populateModal(pcId),
        onClose: () => {
            // Limpar estado se necessário
        }
    });
}

// ===================================
// MODAL DE DETALHES DO PC
// ===================================
function openPCModal(pcId) {
    pcModal.open(pcId);
}

function populateModal(pcId) {
    const pc = window.pcsData.find(p => p.id === pcId);
    if (!pc) return;

    const statusText = {
        'ok': 'Bom Estado',
        'atencao': 'Atenção',
        'critico': 'Crítico'
    };

    // Header
    document.getElementById('modalPcName').textContent = pc.nome;
    document.getElementById('modalPcUser').textContent = `Usuário: ${pc.usuario} | Setor: ${pc.setor}`;

    const statusBadge = document.querySelector('#modalStatus .status-badge');
    statusBadge.className = `status-badge ${pc.status}`;
    statusBadge.textContent = statusText[pc.status];

    // Especificações
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
            <div class="spec-progress">
                <div class="progress-bar">
                    <div class="progress-fill" data-progress="${getRAMPercentage(pc.specs.ram.total)}"></div>
                </div>
            </div>
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
            <div class="spec-progress">
                <div class="progress-bar">
                    <div class="progress-fill" data-progress="${getStoragePercentage(pc.specs.armazenamento)}"></div>
                </div>
            </div>
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

    // Observações
    document.getElementById('modalObservacoes').textContent = pc.observacoes;

    // Recomendações
    const recomendacoesList = document.getElementById('modalRecomendacoes');
    recomendacoesList.innerHTML = pc.recomendacoes.map(rec => `
        <li>
            <i class="fas fa-chevron-right"></i>
            ${rec}
        </li>
    `).join('');

    // Links
    const linksGrid = document.getElementById('modalLinks');
    linksGrid.innerHTML = `
        <a href="${pc.links.compraRam}" class="link-card" target="_blank" rel="noopener">
            <i class="fas fa-memory"></i>
            <span>Comprar RAM</span>
        </a>
        <a href="${pc.links.compraSSD}" class="link-card" target="_blank" rel="noopener">
            <i class="fas fa-hdd"></i>
            <span>Comprar SSD</span>
        </a>
        <a href="${pc.links.compraProcessador}" class="link-card" target="_blank" rel="noopener">
            <i class="fas fa-microchip"></i>
            <span>Processador</span>
        </a>
        <a href="${pc.links.relatorio}" class="link-card" target="_blank" rel="noopener">
            <i class="fas fa-file-pdf"></i>
            <span>Relatório PDF</span>
        </a>
    `;

    // Footer links
    document.getElementById('modalRelatorio').href = pc.links.relatorio;
    document.getElementById('modalCompra').href = pc.links.compraSSD;

    // Animar barras de progresso após abrir modal
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const progress = bar.dataset.progress || 0;
            bar.style.width = progress + '%';
        });
    }, 300);
}

// Funções auxiliares para cálculo de porcentagem
function getRAMPercentage(ramTotal) {
    const gb = parseInt(ramTotal);
    // Considera 16GB como 100%
    return Math.min((gb / 16) * 100, 100);
}

function getStoragePercentage(storage) {
    const total = parseInt(storage.capacidade);
    const used = parseInt(storage.usado);
    return Math.round((used / total) * 100);
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K = Focus na busca
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Ctrl/Cmd + 1-4 = Filtros rápidos
        if ((e.ctrlKey || e.metaKey) && ['1', '2', '3', '4'].includes(e.key)) {
            e.preventDefault();
            const filters = ['all', 'ok', 'atencao', 'critico'];
            const filterIndex = parseInt(e.key) - 1;
            const filterBtn = document.querySelector(`[data-filter="${filters[filterIndex]}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
        }
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                Utils.scrollToElement(target, 100);
            }
        });
    });
}

// ===================================
// LAZY LOADING
// ===================================
function initLazyLoading() {
    // Lazy load de imagens se houver
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para browsers antigos
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ===================================
// EXPORTAÇÕES GLOBAIS
// ===================================
window.openPCModal = openPCModal;
window.cardGrid = cardGrid;
