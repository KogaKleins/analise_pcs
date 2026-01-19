/**
 * ========================================
 * DATA.JS - Dados e Configurações do Sistema
 * Sistema de Análise de Equipamentos
 * ========================================
 * Este arquivo é mantido vazio para compatibilidade.
 * Os dados reais são armazenados via localStorage
 * e gerenciados pelo sistema de clientes (clients.js)
 * 
 * Para adicionar equipamentos, use:
 * - Interface administrativa (/pages/admin.html)
 * - API do Storage: Storage.addEquipamento(dados)
 * - API de Clientes: Clients.addEquipamento(dados, clientId)
 * ========================================
 */

// Array vazio para compatibilidade com código legado
// NÃO adicione dados mockup aqui
const pcsData = [];

// Exportar para uso global (compatibilidade)
if (typeof window !== 'undefined') {
    window.pcsData = pcsData;
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pcsData };
}
