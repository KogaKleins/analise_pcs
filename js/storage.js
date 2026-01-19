/**
 * ========================================
 * STORAGE.JS - Sistema de Armazenamento
 * RS Contabilidade - Análise de Equipamentos
 * ========================================
 * Gerencia dados em localStorage/JSON
 * Preparado para migração futura para banco de dados
 * ========================================
 */

// Chaves de armazenamento
const STORAGE_KEYS = {
    EQUIPAMENTOS: 'rs_equipamentos',
    LINKS: 'rs_links',
    CONFIG: 'rs_config',
    SESSION: 'rs_session'
};

// Estrutura padrão de dados
const DEFAULT_DATA = {
    equipamentos: [],
    links: [],
    config: {
        empresa: 'Sistema de Análise',
        email: '',
        telefone: '',
        endereco: '',
        corPrincipal: '#2563EB', // Azul como padrão
        desenvolvedor: {
            nome: 'Wilmar Izequiel Kleinschmidt',
            email: 'kogakleinscleins@gmail.com',
            telefone: '(48) 99185-0299'
        }
    }
};

/**
 * Classe principal de Storage
 * Abstrai o acesso aos dados para facilitar migração futura
 */
class DataStorage {
    constructor() {
        this.initializeData();
    }

    /**
     * Inicializa dados padrão se não existirem
     */
    initializeData() {
        if (!localStorage.getItem(STORAGE_KEYS.EQUIPAMENTOS)) {
            localStorage.setItem(STORAGE_KEYS.EQUIPAMENTOS, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.LINKS)) {
            localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_DATA.config));
        }
    }

    // ========================================
    // EQUIPAMENTOS
    // ========================================

    /**
     * Retorna todos os equipamentos
     */
    getEquipamentos() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.EQUIPAMENTOS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erro ao carregar equipamentos:', e);
            return [];
        }
    }

    /**
     * Retorna um equipamento pelo ID
     */
    getEquipamento(id) {
        const equipamentos = this.getEquipamentos();
        return equipamentos.find(eq => eq.id === id);
    }

    /**
     * Adiciona novo equipamento
     */
    addEquipamento(equipamento) {
        const equipamentos = this.getEquipamentos();
        
        // Gera ID único
        equipamento.id = this.generateId();
        equipamento.criadoEm = new Date().toISOString();
        equipamento.atualizadoEm = new Date().toISOString();
        
        equipamentos.push(equipamento);
        this.saveEquipamentos(equipamentos);
        
        return equipamento;
    }

    /**
     * Atualiza um equipamento existente
     */
    updateEquipamento(id, dados) {
        const equipamentos = this.getEquipamentos();
        const index = equipamentos.findIndex(eq => eq.id === id);
        
        if (index === -1) {
            throw new Error('Equipamento não encontrado');
        }
        
        equipamentos[index] = {
            ...equipamentos[index],
            ...dados,
            id: id, // Garante que o ID não muda
            atualizadoEm: new Date().toISOString()
        };
        
        this.saveEquipamentos(equipamentos);
        return equipamentos[index];
    }

    /**
     * Remove um equipamento
     */
    deleteEquipamento(id) {
        const equipamentos = this.getEquipamentos();
        const filtered = equipamentos.filter(eq => eq.id !== id);
        
        if (filtered.length === equipamentos.length) {
            throw new Error('Equipamento não encontrado');
        }
        
        this.saveEquipamentos(filtered);
        return true;
    }

    /**
     * Salva array de equipamentos
     */
    saveEquipamentos(equipamentos) {
        localStorage.setItem(STORAGE_KEYS.EQUIPAMENTOS, JSON.stringify(equipamentos));
    }

    // ========================================
    // LINKS DE COMPRA
    // ========================================

    /**
     * Retorna todos os links
     */
    getLinks() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.LINKS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erro ao carregar links:', e);
            return [];
        }
    }

    /**
     * Retorna um link pelo ID
     */
    getLink(id) {
        const links = this.getLinks();
        return links.find(link => link.id === id);
    }

    /**
     * Adiciona novo link
     */
    addLink(link) {
        const links = this.getLinks();
        
        link.id = this.generateId();
        link.criadoEm = new Date().toISOString();
        
        links.push(link);
        this.saveLinks(links);
        
        return link;
    }

    /**
     * Atualiza um link existente
     */
    updateLink(id, dados) {
        const links = this.getLinks();
        const index = links.findIndex(link => link.id === id);
        
        if (index === -1) {
            throw new Error('Link não encontrado');
        }
        
        links[index] = {
            ...links[index],
            ...dados,
            id: id
        };
        
        this.saveLinks(links);
        return links[index];
    }

    /**
     * Remove um link
     */
    deleteLink(id) {
        const links = this.getLinks();
        const filtered = links.filter(link => link.id !== id);
        
        if (filtered.length === links.length) {
            throw new Error('Link não encontrado');
        }
        
        this.saveLinks(filtered);
        return true;
    }

    /**
     * Salva array de links
     */
    saveLinks(links) {
        localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
    }

    /**
     * Retorna links por categoria
     */
    getLinksByCategory(categoria) {
        const links = this.getLinks();
        return links.filter(link => link.categoria === categoria);
    }

    // ========================================
    // CONFIGURAÇÕES
    // ========================================

    /**
     * Retorna configurações
     */
    getConfig() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
            return data ? JSON.parse(data) : DEFAULT_DATA.config;
        } catch (e) {
            console.error('Erro ao carregar configurações:', e);
            return DEFAULT_DATA.config;
        }
    }

    /**
     * Salva configurações
     */
    saveConfig(config) {
        const currentConfig = this.getConfig();
        const newConfig = { ...currentConfig, ...config };
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
        return newConfig;
    }

    // ========================================
    // ESTATÍSTICAS
    // ========================================

    /**
     * Retorna estatísticas dos equipamentos
     */
    getStats() {
        const equipamentos = this.getEquipamentos();
        
        return {
            total: equipamentos.length,
            bom: equipamentos.filter(eq => eq.status === 'bom').length,
            atencao: equipamentos.filter(eq => eq.status === 'atencao').length,
            critico: equipamentos.filter(eq => eq.status === 'critico').length
        };
    }

    // ========================================
    // EXPORTAR/IMPORTAR
    // ========================================

    /**
     * Exporta todos os dados como JSON
     */
    exportData() {
        const data = {
            equipamentos: this.getEquipamentos(),
            links: this.getLinks(),
            config: this.getConfig(),
            exportadoEm: new Date().toISOString(),
            versao: '1.0'
        };
        
        return JSON.stringify(data, null, 2);
    }

    /**
     * Importa dados de JSON
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Validação básica
            if (!data.equipamentos || !data.links) {
                throw new Error('Formato de dados inválido');
            }
            
            // Importa dados
            if (data.equipamentos) {
                this.saveEquipamentos(data.equipamentos);
            }
            if (data.links) {
                this.saveLinks(data.links);
            }
            if (data.config) {
                this.saveConfig(data.config);
            }
            
            return true;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            throw new Error('Erro ao importar: ' + e.message);
        }
    }

    /**
     * Limpa todos os dados
     */
    clearAllData() {
        localStorage.removeItem(STORAGE_KEYS.EQUIPAMENTOS);
        localStorage.removeItem(STORAGE_KEYS.LINKS);
        localStorage.removeItem(STORAGE_KEYS.CONFIG);
        this.initializeData();
    }

    // ========================================
    // UTILITÁRIOS
    // ========================================

    /**
     * Gera ID único
     */
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Busca equipamentos por termo
     */
    searchEquipamentos(termo) {
        const equipamentos = this.getEquipamentos();
        const termoLower = termo.toLowerCase();
        
        return equipamentos.filter(eq => 
            eq.nome?.toLowerCase().includes(termoLower) ||
            eq.usuario?.toLowerCase().includes(termoLower) ||
            eq.setor?.toLowerCase().includes(termoLower) ||
            eq.processador?.toLowerCase().includes(termoLower)
        );
    }

    /**
     * Filtra equipamentos por status
     */
    filterByStatus(status) {
        const equipamentos = this.getEquipamentos();
        return equipamentos.filter(eq => eq.status === status);
    }
}

// Instância global do storage
const Storage = new DataStorage();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Storage, DataStorage, STORAGE_KEYS, DEFAULT_DATA };
}
