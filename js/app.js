/* ===================================
   RS CONTABILIDADE - MAIN JS
   Lógica principal do site (v2.0)
   Sistema com autenticação e Storage
   ===================================
   Desenvolvido por: Wilmar Izequiel Kleinschmidt
   =================================== */

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Verificar autenticação
        if (!checkAuth()) {
            return;
        }

        // Configurar UI baseado na role
        setupUserInterface();

        // Mostrar loading
        showLoadingState();

        // Inicializar componentes
        initHeader();
        initCardGrid();
        initFilterBar();
        initModal();
        
        // Inicializar funcionalidades extras
        initKeyboardShortcuts();
        initSmoothScroll();

        // Remover loading
        hideLoadingState();

        // Mostrar toast de boas-vindas
        setTimeout(() => {
            const session = Auth.getSession();
            if (session && window.Interactions) {
                Interactions.showToast(`Bem-vindo, ${session.name}!`, 'success', 3000);
            }
        }, 500);

    } catch (error) {
        console.error('Erro ao inicializar:', error);
        showErrorState();
    }
}

// ===================================
// AUTENTICAÇÃO
// ===================================
function checkAuth() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function setupUserInterface() {
    const session = Auth.getSession();
    if (!session) return;

    // Atualizar nome do usuário
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = session.name;
    }

    // Mostrar elementos admin
    if (session.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = '';
        });
        
        const adminLink = document.getElementById('adminLink');
        if (adminLink) adminLink.style.display = 'flex';
        
        const adminActions = document.getElementById('adminActions');
        if (adminActions) adminActions.style.display = 'flex';
        
        const emptyAddBtn = document.getElementById('emptyAddBtn');
        if (emptyAddBtn) emptyAddBtn.style.display = 'inline-flex';
        
        // Mudar mensagem do estado vazio para admin
        const emptyMessage = document.getElementById('emptyMessage');
        if (emptyMessage) {
            emptyMessage.textContent = 'Clique no botão abaixo para cadastrar o primeiro equipamento.';
        }
    }

    // Botão de logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            Auth.logout();
        });
    }
}

// ===================================
// LOADING STATE
// ===================================
function showLoadingState() {
    const grid = document.getElementById('pcsGrid');
    if (!grid) return;

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
    // Grid será substituído pelo render dos cards
}

function showErrorState() {
    const grid = document.getElementById('pcsGrid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Erro ao carregar dados</h3>
            <p>Tente recarregar a página</p>
            <button class="btn btn-primary" onclick="location.reload()">
                <i class="fas fa-redo"></i> Recarregar
            </button>
        </div>
    `;
}

// ===================================
// DADOS DO STORAGE
// ===================================
function getEquipamentos() {
    return Storage.getEquipamentos();
}

function getLinks() {
    return Storage.getLinks();
}

// ===================================
// COMPONENTES
// ===================================
function initHeader() {
    // Menu mobile toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

function initCardGrid() {
    const grid = document.getElementById('pcsGrid');
    const emptyState = document.getElementById('emptyState');
    const equipamentos = getEquipamentos();

    if (equipamentos.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        updateStats(equipamentos);
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    renderCards(equipamentos);
    updateStats(equipamentos);
}

function renderCards(equipamentos, filter = 'all', searchTerm = '') {
    const grid = document.getElementById('pcsGrid');
    const emptyState = document.getElementById('emptyState');
    
    // Filtrar dados
    let filtered = equipamentos;
    
    if (filter !== 'all') {
        const filterMap = { 'ok': 'bom', 'atencao': 'atencao', 'critico': 'critico', 'bom': 'bom' };
        filtered = filtered.filter(eq => eq.status === filterMap[filter] || eq.status === filter);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(eq => 
            eq.nome?.toLowerCase().includes(term) ||
            eq.usuario?.toLowerCase().includes(term) ||
            eq.setor?.toLowerCase().includes(term) ||
            eq.processador?.toLowerCase().includes(term)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum resultado encontrado</h3>
                <p>Tente ajustar os filtros ou termo de busca</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(eq => createCardHTML(eq)).join('');
    
    // Adicionar evento de clique nos cards
    grid.querySelectorAll('.pc-card').forEach(card => {
        card.addEventListener('click', () => {
            const pcId = card.dataset.id;
            openPCModal(pcId);
        });
    });
}

function createCardHTML(eq) {
    const statusLabels = {
        'bom': 'Bom Estado',
        'atencao': 'Atenção',
        'critico': 'Crítico',
        'ok': 'Bom Estado'
    };

    const statusClass = eq.status === 'ok' ? 'bom' : eq.status;

    return `
        <div class="pc-card glass-card" data-id="${eq.id}" data-status="${statusClass}">
            <div class="pc-card-header">
                <div class="pc-card-icon">
                    <i class="fas fa-desktop"></i>
                </div>
                <div class="pc-card-title">
                    <h3>${eq.nome || 'Sem nome'}</h3>
                    <span class="pc-card-user">${eq.usuario || 'N/A'}</span>
                </div>
                <div class="pc-card-status ${statusClass}">
                    <span>${statusLabels[eq.status] || 'N/A'}</span>
                </div>
            </div>
            <div class="pc-card-specs">
                <div class="spec-item">
                    <i class="fas fa-microchip"></i>
                    <span>${eq.processador || 'N/A'}</span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-memory"></i>
                    <span>${eq.ram || 'N/A'}</span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-hdd"></i>
                    <span>${eq.storage || 'N/A'}</span>
                </div>
            </div>
            <div class="pc-card-footer">
                <span class="pc-card-sector">
                    <i class="fas fa-building"></i>
                    ${eq.setor || 'N/A'}
                </span>
                <button class="btn-details">
                    Ver Detalhes <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
}

function updateStats(equipamentos) {
    if (!equipamentos) equipamentos = getEquipamentos();
    
    const total = equipamentos.length;
    const bom = equipamentos.filter(eq => eq.status === 'bom' || eq.status === 'ok').length;
    const atencao = equipamentos.filter(eq => eq.status === 'atencao' || eq.status === 'critico').length;

    const totalEl = document.getElementById('totalPCs');
    const okEl = document.getElementById('pcsOk');
    const atencaoEl = document.getElementById('pcsAtencao');

    if (totalEl) animateNumber(totalEl, total);
    if (okEl) animateNumber(okEl, bom);
    if (atencaoEl) animateNumber(atencaoEl, atencao);
}

function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const duration = 500;
    const steps = Math.abs(target - current);
    const stepTime = duration / steps;

    if (steps === 0) return;

    let count = current;
    const timer = setInterval(() => {
        count += increment;
        element.textContent = count;
        if (count === target) clearInterval(timer);
    }, stepTime);
}

// ===================================
// FILTROS E BUSCA
// ===================================
let currentFilter = 'all';
let currentSearch = '';

function initFilterBar() {
    // Botões de filtro
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderCards(getEquipamentos(), currentFilter, currentSearch);
        });
    });

    // Input de busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentSearch = e.target.value;
            renderCards(getEquipamentos(), currentFilter, currentSearch);
        }, 300));
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// MODAL
// ===================================
function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // ESC para fechar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openPCModal(pcId) {
    const overlay = document.getElementById('modalOverlay');
    const equipamento = Storage.getEquipamento(pcId);
    
    if (!equipamento || !overlay) return;

    populateModal(equipamento);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function populateModal(eq) {
    const statusLabels = {
        'bom': 'Bom Estado',
        'atencao': 'Atenção',
        'critico': 'Crítico',
        'ok': 'Bom Estado'
    };

    // Header
    document.getElementById('modalPcName').textContent = eq.nome || 'Sem nome';
    document.getElementById('modalPcUser').textContent = `Usuário: ${eq.usuario || 'N/A'} | Setor: ${eq.setor || 'N/A'}`;

    const statusBadge = document.querySelector('#modalStatus .status-badge');
    if (statusBadge) {
        const statusClass = eq.status === 'ok' ? 'bom' : eq.status;
        statusBadge.className = `status-badge ${statusClass}`;
        statusBadge.textContent = statusLabels[eq.status] || 'N/A';
    }

    // Especificações
    const specsGrid = document.getElementById('modalSpecs');
    if (specsGrid) {
        specsGrid.innerHTML = `
            <div class="spec-card">
                <div class="spec-card-header">
                    <div class="spec-card-icon"><i class="fas fa-memory"></i></div>
                    <span class="spec-card-label">Memória RAM</span>
                </div>
                <div class="spec-card-value">${eq.ram || 'N/A'}</div>
                <div class="spec-card-progress">
                    <div class="progress-bar" style="width: ${eq.ramScore || 0}%"></div>
                </div>
            </div>
            <div class="spec-card">
                <div class="spec-card-header">
                    <div class="spec-card-icon"><i class="fas fa-hdd"></i></div>
                    <span class="spec-card-label">Armazenamento</span>
                </div>
                <div class="spec-card-value">${eq.storage || 'N/A'}</div>
                <div class="spec-card-progress">
                    <div class="progress-bar" style="width: ${eq.storageScore || 0}%"></div>
                </div>
            </div>
            <div class="spec-card">
                <div class="spec-card-header">
                    <div class="spec-card-icon"><i class="fas fa-microchip"></i></div>
                    <span class="spec-card-label">Processador</span>
                </div>
                <div class="spec-card-value">${eq.processador || 'N/A'}</div>
                <div class="spec-card-progress">
                    <div class="progress-bar" style="width: ${eq.cpuScore || 0}%"></div>
                </div>
            </div>
            <div class="spec-card">
                <div class="spec-card-header">
                    <div class="spec-card-icon"><i class="fas fa-tv"></i></div>
                    <span class="spec-card-label">Placa de Vídeo</span>
                </div>
                <div class="spec-card-value">${eq.gpu || 'Integrada'}</div>
            </div>
            <div class="spec-card">
                <div class="spec-card-header">
                    <div class="spec-card-icon"><i class="fab fa-windows"></i></div>
                    <span class="spec-card-label">Sistema Operacional</span>
                </div>
                <div class="spec-card-value">${eq.so || 'N/A'}</div>
            </div>
        `;
    }

    // Observações
    const obsEl = document.getElementById('modalObservacoes');
    if (obsEl) {
        obsEl.textContent = eq.observacoes || 'Nenhuma observação registrada.';
    }

    // Recomendações
    const recEl = document.getElementById('modalRecomendacoes');
    if (recEl) {
        if (eq.recomendacoes) {
            recEl.innerHTML = `<li>${eq.recomendacoes}</li>`;
        } else {
            recEl.innerHTML = '<li>Nenhuma recomendação no momento.</li>';
        }
    }

    // Links
    const linksGrid = document.getElementById('modalLinks');
    if (linksGrid) {
        const links = getLinks();
        if (links.length > 0) {
            linksGrid.innerHTML = links.slice(0, 4).map(link => `
                <a href="${link.url}" target="_blank" class="modal-link">
                    <i class="fas fa-shopping-cart"></i>
                    <span>${link.titulo}</span>
                </a>
            `).join('');
        } else {
            linksGrid.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Nenhum link cadastrado.</p>';
        }
    }
}

// ===================================
// UTILITÁRIOS
// ===================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+K para busca
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Exportar funções globais
window.openPCModal = openPCModal;
