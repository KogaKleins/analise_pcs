/**
 * ========================================
 * ADMIN.JS - Painel Administrativo
 * RS Contabilidade - Análise de Equipamentos
 * ========================================
 * Desenvolvido por: Wilmar Izequiel Kleinschmidt
 * ========================================
 */

// Verificar autenticação e permissão admin
document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.requireAdmin()) {
        return;
    }
    
    // Atualizar nome do usuário
    const session = Auth.getSession();
    if (session) {
        document.getElementById('userName').textContent = session.name;
    }
    
    // Inicializar painel
    AdminPanel.init();
});

/**
 * Classe principal do Painel Administrativo
 */
const AdminPanel = {
    currentEditId: null,
    confirmCallback: null,

    /**
     * Inicializa o painel
     */
    init() {
        this.bindEvents();
        this.loadData();
        this.updateStats();
    },

    /**
     * Vincula eventos
     */
    bindEvents() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Botões de novo
        document.getElementById('btnNovoEquipamento').addEventListener('click', () => this.openEquipamentoModal());
        document.getElementById('btnNovoLink').addEventListener('click', () => this.openLinkModal());

        // Salvar equipamento
        document.getElementById('btnSalvarEquipamento').addEventListener('click', () => this.saveEquipamento());
        document.getElementById('btnSalvarLink').addEventListener('click', () => this.saveLink());

        // Configurações
        document.getElementById('btnSalvarConfig').addEventListener('click', () => this.saveConfig());

        // Exportar/Importar
        document.getElementById('btnExportar').addEventListener('click', () => this.exportData());
        document.getElementById('btnImportar').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
        document.getElementById('btnLimpar').addEventListener('click', () => this.confirmClearData());

        // Fechar modal ao clicar no overlay
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Tecla ESC para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    },

    /**
     * Troca de tab
     */
    switchTab(tabId) {
        // Desativa todas as tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Ativa tab selecionada
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    },

    /**
     * Carrega dados do storage
     */
    loadData() {
        this.renderEquipamentos();
        this.renderLinks();
        this.loadConfig();
    },

    /**
     * Atualiza estatísticas
     */
    updateStats() {
        const stats = Storage.getStats();
        document.getElementById('totalEquipamentos').textContent = stats.total;
        document.getElementById('totalBom').textContent = stats.bom;
        document.getElementById('totalAtencao').textContent = stats.atencao + stats.critico;
    },

    // ========================================
    // EQUIPAMENTOS
    // ========================================

    /**
     * Renderiza lista de equipamentos
     */
    renderEquipamentos() {
        const equipamentos = Storage.getEquipamentos();
        const container = document.getElementById('equipmentList');
        const emptyState = document.getElementById('emptyState');

        if (equipamentos.length === 0) {
            container.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        container.innerHTML = equipamentos.map(eq => this.createEquipamentoItem(eq)).join('');
    },

    /**
     * Cria HTML de item de equipamento
     */
    createEquipamentoItem(eq) {
        const statusLabels = {
            bom: 'Bom',
            atencao: 'Atenção',
            critico: 'Crítico'
        };

        return `
            <div class="equipment-item" data-id="${eq.id}">
                <div class="equipment-icon">
                    <i class="fas fa-desktop"></i>
                </div>
                <div class="equipment-info">
                    <div class="equipment-name">${eq.nome || 'Sem nome'}</div>
                    <div class="equipment-details">
                        <span><i class="fas fa-user"></i> ${eq.usuario || 'N/A'}</span>
                        <span><i class="fas fa-building"></i> ${eq.setor || 'N/A'}</span>
                        <span><i class="fas fa-microchip"></i> ${eq.processador || 'N/A'}</span>
                    </div>
                </div>
                <span class="equipment-status ${eq.status}">${statusLabels[eq.status] || 'N/A'}</span>
                <div class="equipment-actions">
                    <button class="btn-icon edit" onclick="AdminPanel.editEquipamento('${eq.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="AdminPanel.confirmDeleteEquipamento('${eq.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Abre modal de equipamento (novo ou edição)
     */
    openEquipamentoModal(id = null) {
        this.currentEditId = id;
        const modal = document.getElementById('modalEquipamento');
        const title = document.getElementById('modalEquipamentoTitle');
        const form = document.getElementById('formEquipamento');

        if (id) {
            const eq = Storage.getEquipamento(id);
            if (eq) {
                title.textContent = 'Editar Equipamento';
                this.fillEquipamentoForm(eq);
            }
        } else {
            title.textContent = 'Novo Equipamento';
            form.reset();
        }

        modal.classList.add('show');
    },

    /**
     * Preenche formulário de equipamento
     */
    fillEquipamentoForm(eq) {
        document.getElementById('equipamentoId').value = eq.id;
        document.getElementById('eqNome').value = eq.nome || '';
        document.getElementById('eqUsuario').value = eq.usuario || '';
        document.getElementById('eqSetor').value = eq.setor || '';
        document.getElementById('eqStatus').value = eq.status || 'bom';
        document.getElementById('eqProcessador').value = eq.processador || '';
        document.getElementById('eqCpuScore').value = eq.cpuScore || '';
        document.getElementById('eqRam').value = eq.ram || '';
        document.getElementById('eqRamScore').value = eq.ramScore || '';
        document.getElementById('eqStorage').value = eq.storage || '';
        document.getElementById('eqStorageScore').value = eq.storageScore || '';
        document.getElementById('eqGpu').value = eq.gpu || '';
        document.getElementById('eqSo').value = eq.so || '';
        document.getElementById('eqObservacoes').value = eq.observacoes || '';
        document.getElementById('eqRecomendacoes').value = eq.recomendacoes || '';
    },

    /**
     * Salva equipamento
     */
    saveEquipamento() {
        const dados = {
            nome: document.getElementById('eqNome').value,
            usuario: document.getElementById('eqUsuario').value,
            setor: document.getElementById('eqSetor').value,
            status: document.getElementById('eqStatus').value,
            processador: document.getElementById('eqProcessador').value,
            cpuScore: parseInt(document.getElementById('eqCpuScore').value) || 0,
            ram: document.getElementById('eqRam').value,
            ramScore: parseInt(document.getElementById('eqRamScore').value) || 0,
            storage: document.getElementById('eqStorage').value,
            storageScore: parseInt(document.getElementById('eqStorageScore').value) || 0,
            gpu: document.getElementById('eqGpu').value,
            so: document.getElementById('eqSo').value,
            observacoes: document.getElementById('eqObservacoes').value,
            recomendacoes: document.getElementById('eqRecomendacoes').value
        };

        // Validação
        if (!dados.nome) {
            this.showToast('Nome do equipamento é obrigatório', 'error');
            return;
        }

        try {
            if (this.currentEditId) {
                Storage.updateEquipamento(this.currentEditId, dados);
                this.showToast('Equipamento atualizado com sucesso!', 'success');
            } else {
                Storage.addEquipamento(dados);
                this.showToast('Equipamento cadastrado com sucesso!', 'success');
            }

            this.closeModal('modalEquipamento');
            this.renderEquipamentos();
            this.updateStats();
        } catch (e) {
            this.showToast('Erro ao salvar: ' + e.message, 'error');
        }
    },

    /**
     * Editar equipamento
     */
    editEquipamento(id) {
        this.openEquipamentoModal(id);
    },

    /**
     * Confirmar exclusão de equipamento
     */
    confirmDeleteEquipamento(id) {
        const eq = Storage.getEquipamento(id);
        document.getElementById('confirmMessage').textContent = 
            `Tem certeza que deseja excluir o equipamento "${eq?.nome || id}"?`;
        
        this.confirmCallback = () => {
            try {
                Storage.deleteEquipamento(id);
                this.showToast('Equipamento excluído com sucesso!', 'success');
                this.renderEquipamentos();
                this.updateStats();
            } catch (e) {
                this.showToast('Erro ao excluir: ' + e.message, 'error');
            }
        };

        document.getElementById('btnConfirmAction').onclick = () => {
            this.confirmCallback();
            this.closeModal('modalConfirm');
        };

        document.getElementById('modalConfirm').classList.add('show');
    },

    // ========================================
    // LINKS
    // ========================================

    /**
     * Renderiza lista de links
     */
    renderLinks() {
        const links = Storage.getLinks();
        const container = document.getElementById('linksList');
        const emptyState = document.getElementById('emptyLinks');

        if (links.length === 0) {
            container.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        container.innerHTML = links.map(link => this.createLinkItem(link)).join('');
    },

    /**
     * Cria HTML de item de link
     */
    createLinkItem(link) {
        const categoryLabels = {
            ram: 'RAM',
            ssd: 'SSD',
            processador: 'CPU',
            gpu: 'GPU',
            periferico: 'Periférico',
            outro: 'Outro'
        };

        return `
            <div class="link-item" data-id="${link.id}">
                <span class="link-category">${categoryLabels[link.categoria] || link.categoria}</span>
                <div class="link-info">
                    <div class="link-title">${link.titulo}</div>
                    <div class="link-meta">
                        ${link.preco ? `<span class="link-price">R$ ${link.preco}</span>` : ''}
                        ${link.loja ? `<span><i class="fas fa-store"></i> ${link.loja}</span>` : ''}
                        <a href="${link.url}" target="_blank" class="link-url"><i class="fas fa-external-link-alt"></i> Ver produto</a>
                    </div>
                </div>
                <div class="equipment-actions">
                    <button class="btn-icon edit" onclick="AdminPanel.editLink('${link.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="AdminPanel.confirmDeleteLink('${link.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Abre modal de link
     */
    openLinkModal(id = null) {
        this.currentEditId = id;
        const modal = document.getElementById('modalLink');
        const title = document.getElementById('modalLinkTitle');
        const form = document.getElementById('formLink');

        if (id) {
            const link = Storage.getLink(id);
            if (link) {
                title.textContent = 'Editar Link';
                this.fillLinkForm(link);
            }
        } else {
            title.textContent = 'Novo Link de Compra';
            form.reset();
        }

        modal.classList.add('show');
    },

    /**
     * Preenche formulário de link
     */
    fillLinkForm(link) {
        document.getElementById('linkId').value = link.id;
        document.getElementById('linkCategoria').value = link.categoria || '';
        document.getElementById('linkTitulo').value = link.titulo || '';
        document.getElementById('linkUrl').value = link.url || '';
        document.getElementById('linkPreco').value = link.preco || '';
        document.getElementById('linkLoja').value = link.loja || '';
        document.getElementById('linkObs').value = link.observacoes || '';
    },

    /**
     * Salva link
     */
    saveLink() {
        const dados = {
            categoria: document.getElementById('linkCategoria').value,
            titulo: document.getElementById('linkTitulo').value,
            url: document.getElementById('linkUrl').value,
            preco: document.getElementById('linkPreco').value,
            loja: document.getElementById('linkLoja').value,
            observacoes: document.getElementById('linkObs').value
        };

        // Validação
        if (!dados.categoria || !dados.titulo || !dados.url) {
            this.showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        try {
            if (this.currentEditId) {
                Storage.updateLink(this.currentEditId, dados);
                this.showToast('Link atualizado com sucesso!', 'success');
            } else {
                Storage.addLink(dados);
                this.showToast('Link cadastrado com sucesso!', 'success');
            }

            this.closeModal('modalLink');
            this.renderLinks();
        } catch (e) {
            this.showToast('Erro ao salvar: ' + e.message, 'error');
        }
    },

    /**
     * Editar link
     */
    editLink(id) {
        this.openLinkModal(id);
    },

    /**
     * Confirmar exclusão de link
     */
    confirmDeleteLink(id) {
        const link = Storage.getLink(id);
        document.getElementById('confirmMessage').textContent = 
            `Tem certeza que deseja excluir o link "${link?.titulo || id}"?`;
        
        this.confirmCallback = () => {
            try {
                Storage.deleteLink(id);
                this.showToast('Link excluído com sucesso!', 'success');
                this.renderLinks();
            } catch (e) {
                this.showToast('Erro ao excluir: ' + e.message, 'error');
            }
        };

        document.getElementById('btnConfirmAction').onclick = () => {
            this.confirmCallback();
            this.closeModal('modalConfirm');
        };

        document.getElementById('modalConfirm').classList.add('show');
    },

    // ========================================
    // CONFIGURAÇÕES
    // ========================================

    /**
     * Carrega configurações
     */
    loadConfig() {
        const config = Storage.getConfig();
        document.getElementById('configEmpresa').value = config.empresa || '';
        document.getElementById('configEmail').value = config.email || '';
        document.getElementById('configTelefone').value = config.telefone || '';
        document.getElementById('configEndereco').value = config.endereco || '';
        document.getElementById('configCor').value = config.corPrincipal || '#2563EB';
    },

    /**
     * Salva configurações
     */
    saveConfig() {
        const config = {
            empresa: document.getElementById('configEmpresa').value,
            email: document.getElementById('configEmail').value,
            telefone: document.getElementById('configTelefone').value,
            endereco: document.getElementById('configEndereco').value,
            corPrincipal: document.getElementById('configCor').value
        };

        try {
            Storage.saveConfig(config);
            this.showToast('Configurações salvas com sucesso!', 'success');
            
            // Aplicar cor principal
            document.documentElement.style.setProperty('--primary', config.corPrincipal);
        } catch (e) {
            this.showToast('Erro ao salvar: ' + e.message, 'error');
        }
    },

    // ========================================
    // EXPORTAR/IMPORTAR
    // ========================================

    /**
     * Exporta dados para JSON
     */
    exportData() {
        try {
            const data = Storage.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `rs_contabilidade_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Dados exportados com sucesso!', 'success');
        } catch (e) {
            this.showToast('Erro ao exportar: ' + e.message, 'error');
        }
    },

    /**
     * Importa dados de JSON
     */
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                Storage.importData(e.target.result);
                this.showToast('Dados importados com sucesso!', 'success');
                this.loadData();
                this.updateStats();
            } catch (err) {
                this.showToast('Erro ao importar: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
        
        // Limpar input
        event.target.value = '';
    },

    /**
     * Confirma limpeza de dados
     */
    confirmClearData() {
        document.getElementById('confirmMessage').textContent = 
            'ATENÇÃO: Esta ação irá remover TODOS os dados do sistema. Esta ação é irreversível!';
        
        this.confirmCallback = () => {
            Storage.clearAllData();
            this.showToast('Todos os dados foram removidos', 'warning');
            this.loadData();
            this.updateStats();
        };

        document.getElementById('btnConfirmAction').onclick = () => {
            this.confirmCallback();
            this.closeModal('modalConfirm');
        };

        document.getElementById('modalConfirm').classList.add('show');
    },

    // ========================================
    // UTILITÁRIOS
    // ========================================

    /**
     * Fecha modal específico
     */
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        this.currentEditId = null;
    },

    /**
     * Fecha todos os modais
     */
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        this.currentEditId = null;
    },

    /**
     * Mostra toast notification
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Remove após 4 segundos
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// Adicionar animação de saída do toast
const style = document.createElement('style');
style.textContent = `
    @keyframes toastOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(50px); }
    }
`;
document.head.appendChild(style);
