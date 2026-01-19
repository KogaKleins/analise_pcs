/**
 * ========================================
 * CLIENTS.JS - Sistema de Gerenciamento de Clientes
 * Sistema de Análise de Equipamentos
 * ========================================
 * Gerencia múltiplos clientes e seus equipamentos
 * Cada cliente tem seu próprio tema e dados
 * ========================================
 */

// Chaves de armazenamento para clientes
const CLIENT_STORAGE_KEYS = {
    CLIENTS: 'sys_clients',
    CURRENT_CLIENT: 'sys_current_client'
};

// Configuração de clientes disponíveis
// Em produção, isso viria de um backend
const DEFAULT_CLIENTS = [
    {
        id: 'rs-contabilidade',
        nome: 'RS Contabilidade',
        slug: 'rs-contabilidade',
        tema: 'rs-contabilidade',
        logo: null,
        corPrimaria: '#8B0000',
        email: 'contato@rscontabilidade.com.br',
        telefone: '',
        endereco: '',
        ativo: true,
        criadoEm: '2024-01-01T00:00:00.000Z'
    }
];

/**
 * Classe de Gerenciamento de Clientes
 */
class ClientManager {
    constructor() {
        this.currentClient = null;
        this.initializeClients();
    }

    /**
     * Inicializa os clientes padrão se não existirem
     */
    initializeClients() {
        if (!localStorage.getItem(CLIENT_STORAGE_KEYS.CLIENTS)) {
            localStorage.setItem(CLIENT_STORAGE_KEYS.CLIENTS, JSON.stringify(DEFAULT_CLIENTS));
        }
    }

    // ========================================
    // CRUD DE CLIENTES
    // ========================================

    /**
     * Retorna todos os clientes
     */
    getAll() {
        try {
            const data = localStorage.getItem(CLIENT_STORAGE_KEYS.CLIENTS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erro ao carregar clientes:', e);
            return [];
        }
    }

    /**
     * Retorna um cliente pelo ID
     */
    getById(id) {
        const clients = this.getAll();
        return clients.find(c => c.id === id);
    }

    /**
     * Retorna um cliente pelo slug
     */
    getBySlug(slug) {
        const clients = this.getAll();
        return clients.find(c => c.slug === slug);
    }

    /**
     * Adiciona um novo cliente
     */
    add(clientData) {
        const clients = this.getAll();
        
        // Gera ID e slug únicos
        const client = {
            id: this.generateId(),
            slug: this.generateSlug(clientData.nome),
            tema: 'default', // Tema padrão azul
            logo: null,
            corPrimaria: '#2563EB',
            ativo: true,
            criadoEm: new Date().toISOString(),
            ...clientData
        };

        // Verifica se já existe cliente com mesmo nome
        if (clients.find(c => c.nome.toLowerCase() === client.nome.toLowerCase())) {
            throw new Error('Já existe um cliente com este nome');
        }

        clients.push(client);
        this.saveAll(clients);

        // Inicializa storage do cliente
        this.initializeClientStorage(client.id);

        return client;
    }

    /**
     * Atualiza um cliente existente
     */
    update(id, dados) {
        const clients = this.getAll();
        const index = clients.findIndex(c => c.id === id);
        
        if (index === -1) {
            throw new Error('Cliente não encontrado');
        }

        clients[index] = {
            ...clients[index],
            ...dados,
            id: id, // Garante que o ID não muda
            atualizadoEm: new Date().toISOString()
        };

        this.saveAll(clients);
        return clients[index];
    }

    /**
     * Remove um cliente
     */
    delete(id) {
        const clients = this.getAll();
        const filtered = clients.filter(c => c.id !== id);
        
        if (filtered.length === clients.length) {
            throw new Error('Cliente não encontrado');
        }

        // Remove dados do cliente
        this.clearClientStorage(id);

        this.saveAll(filtered);
        return true;
    }

    /**
     * Salva array de clientes
     */
    saveAll(clients) {
        localStorage.setItem(CLIENT_STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    }

    // ========================================
    // CLIENTE ATUAL
    // ========================================

    /**
     * Define o cliente atual (selecionado)
     */
    setCurrent(clientId) {
        const client = this.getById(clientId);
        if (!client) {
            throw new Error('Cliente não encontrado');
        }

        this.currentClient = client;
        localStorage.setItem(CLIENT_STORAGE_KEYS.CURRENT_CLIENT, clientId);

        // Aplicar tema do cliente
        if (typeof setAppTheme === 'function') {
            setAppTheme(client.tema || 'default');
        }

        // Disparar evento
        window.dispatchEvent(new CustomEvent('clientChanged', { 
            detail: { client } 
        }));

        return client;
    }

    /**
     * Retorna o cliente atual
     */
    getCurrent() {
        if (this.currentClient) {
            return this.currentClient;
        }

        const currentId = localStorage.getItem(CLIENT_STORAGE_KEYS.CURRENT_CLIENT);
        if (currentId) {
            this.currentClient = this.getById(currentId);
            return this.currentClient;
        }

        return null;
    }

    /**
     * Limpa o cliente atual (volta para visão geral)
     */
    clearCurrent() {
        this.currentClient = null;
        localStorage.removeItem(CLIENT_STORAGE_KEYS.CURRENT_CLIENT);

        // Voltar para tema padrão
        if (typeof setAppTheme === 'function') {
            setAppTheme('default');
        }

        // Disparar evento
        window.dispatchEvent(new CustomEvent('clientChanged', { 
            detail: { client: null } 
        }));
    }

    // ========================================
    // STORAGE POR CLIENTE
    // ========================================

    /**
     * Gera chave de storage específica do cliente
     */
    getClientStorageKey(clientId, key) {
        return `client_${clientId}_${key}`;
    }

    /**
     * Inicializa storage de um cliente
     */
    initializeClientStorage(clientId) {
        const equipKey = this.getClientStorageKey(clientId, 'equipamentos');
        const linksKey = this.getClientStorageKey(clientId, 'links');
        const configKey = this.getClientStorageKey(clientId, 'config');

        if (!localStorage.getItem(equipKey)) {
            localStorage.setItem(equipKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(linksKey)) {
            localStorage.setItem(linksKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(configKey)) {
            localStorage.setItem(configKey, JSON.stringify({}));
        }
    }

    /**
     * Limpa storage de um cliente
     */
    clearClientStorage(clientId) {
        const keys = ['equipamentos', 'links', 'config', 'sugestoes'];
        keys.forEach(key => {
            localStorage.removeItem(this.getClientStorageKey(clientId, key));
        });
    }

    /**
     * Retorna equipamentos do cliente atual
     */
    getEquipamentos(clientId = null) {
        const id = clientId || this.getCurrent()?.id;
        if (!id) return [];

        try {
            const key = this.getClientStorageKey(id, 'equipamentos');
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erro ao carregar equipamentos:', e);
            return [];
        }
    }

    /**
     * Salva equipamentos do cliente
     */
    saveEquipamentos(equipamentos, clientId = null) {
        const id = clientId || this.getCurrent()?.id;
        if (!id) throw new Error('Nenhum cliente selecionado');

        const key = this.getClientStorageKey(id, 'equipamentos');
        localStorage.setItem(key, JSON.stringify(equipamentos));
    }

    /**
     * Adiciona equipamento ao cliente
     */
    addEquipamento(equipamento, clientId = null) {
        const equipamentos = this.getEquipamentos(clientId);
        
        equipamento.id = this.generateId();
        equipamento.criadoEm = new Date().toISOString();
        equipamento.atualizadoEm = new Date().toISOString();
        
        equipamentos.push(equipamento);
        this.saveEquipamentos(equipamentos, clientId);
        
        return equipamento;
    }

    /**
     * Atualiza equipamento do cliente
     */
    updateEquipamento(equipamentoId, dados, clientId = null) {
        const equipamentos = this.getEquipamentos(clientId);
        const index = equipamentos.findIndex(eq => eq.id === equipamentoId);
        
        if (index === -1) {
            throw new Error('Equipamento não encontrado');
        }

        equipamentos[index] = {
            ...equipamentos[index],
            ...dados,
            id: equipamentoId,
            atualizadoEm: new Date().toISOString()
        };

        this.saveEquipamentos(equipamentos, clientId);
        return equipamentos[index];
    }

    /**
     * Remove equipamento do cliente
     */
    deleteEquipamento(equipamentoId, clientId = null) {
        const equipamentos = this.getEquipamentos(clientId);
        const filtered = equipamentos.filter(eq => eq.id !== equipamentoId);
        
        if (filtered.length === equipamentos.length) {
            throw new Error('Equipamento não encontrado');
        }

        this.saveEquipamentos(filtered, clientId);
        return true;
    }

    /**
     * Retorna estatísticas do cliente
     */
    getStats(clientId = null) {
        const equipamentos = this.getEquipamentos(clientId);
        
        return {
            total: equipamentos.length,
            bom: equipamentos.filter(eq => eq.status === 'ok' || eq.status === 'bom').length,
            atencao: equipamentos.filter(eq => eq.status === 'atencao').length,
            critico: equipamentos.filter(eq => eq.status === 'critico').length
        };
    }

    // ========================================
    // SUGESTÕES POR CLIENTE
    // ========================================

    /**
     * Retorna sugestões/links do cliente
     */
    getSugestoes(clientId = null) {
        const id = clientId || this.getCurrent()?.id;
        if (!id) return [];

        try {
            const key = this.getClientStorageKey(id, 'links');
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erro ao carregar sugestões:', e);
            return [];
        }
    }

    /**
     * Salva sugestões do cliente
     */
    saveSugestoes(sugestoes, clientId = null) {
        const id = clientId || this.getCurrent()?.id;
        if (!id) throw new Error('Nenhum cliente selecionado');

        const key = this.getClientStorageKey(id, 'links');
        localStorage.setItem(key, JSON.stringify(sugestoes));
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
     * Gera slug a partir do nome
     */
    generateSlug(nome) {
        return nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    /**
     * Busca clientes por termo
     */
    search(termo) {
        const clients = this.getAll();
        const termoLower = termo.toLowerCase();
        
        return clients.filter(c => 
            c.nome?.toLowerCase().includes(termoLower) ||
            c.email?.toLowerCase().includes(termoLower)
        );
    }

    /**
     * Exporta dados de um cliente
     */
    exportClientData(clientId) {
        const client = this.getById(clientId);
        if (!client) throw new Error('Cliente não encontrado');

        return {
            cliente: client,
            equipamentos: this.getEquipamentos(clientId),
            sugestoes: this.getSugestoes(clientId),
            exportadoEm: new Date().toISOString(),
            versao: '2.0'
        };
    }

    /**
     * Importa dados de um cliente
     */
    importClientData(jsonData, clientId) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            if (data.equipamentos) {
                this.saveEquipamentos(data.equipamentos, clientId);
            }
            if (data.sugestoes) {
                this.saveSugestoes(data.sugestoes, clientId);
            }

            return true;
        } catch (e) {
            console.error('Erro ao importar dados:', e);
            throw new Error('Erro ao importar: ' + e.message);
        }
    }
}

// Instância global do gerenciador de clientes
const Clients = new ClientManager();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Clients, ClientManager, CLIENT_STORAGE_KEYS };
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.Clients = Clients;
}
