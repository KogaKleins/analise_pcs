/**
 * ========================================
 * AUTH.JS - Sistema de Autenticação
 * RS Contabilidade - Análise de Equipamentos
 * ========================================
 * Desenvolvido por: Wilmar Izequiel Kleinschmidt
 * Email: kogakleinscleins@gmail.com
 * Telefone: (48) 99185-0299
 * ========================================
 */

// Configuração de usuários (em produção, isso viria de um backend)
const USERS_CONFIG = {
    admin: {
        username: 'WIlmarkogakleins',
        password: 'WILMARkk793!!@#..77ISSO',
        role: 'admin',
        name: 'Wilmar Izequiel Kleinschmidt',
        email: 'kogakleinscleins@gmail.com'
    },
    client: {
        username: 'RS contabilidade',
        password: 'Rs3434-4099!@@#equipamentos??',
        role: 'user',
        name: 'RS Contabilidade',
        email: 'contato@rscontabilidade.com.br'
    }
};

// Classe principal de autenticação
class AuthSystem {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.loginBtn = document.getElementById('btnLogin');
        this.errorDiv = document.getElementById('authError');
        this.errorMessage = document.getElementById('errorMessage');
        
        this.init();
    }

    init() {
        // Verificar se já está logado
        this.checkExistingSession();
        
        // Event listeners
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        this.togglePasswordBtn.addEventListener('click', () => this.togglePassword());
        
        // Carregar credenciais salvas
        this.loadRememberedCredentials();
        
        // Adicionar efeitos visuais
        this.initVisualEffects();
    }

    checkExistingSession() {
        const session = localStorage.getItem('rs_session');
        if (session) {
            const sessionData = JSON.parse(session);
            // Verificar se a sessão ainda é válida (24 horas)
            if (Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
                this.redirectToDashboard(sessionData.role);
            } else {
                localStorage.removeItem('rs_session');
            }
        }
    }

    loadRememberedCredentials() {
        const remembered = localStorage.getItem('rs_remember');
        if (remembered) {
            const data = JSON.parse(remembered);
            this.usernameInput.value = data.username;
            this.rememberMeCheckbox.checked = true;
        }
    }

    togglePassword() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const icon = this.togglePasswordBtn.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        // Esconder erro anterior
        this.hideError();
        
        // Mostrar loading
        this.setLoadingState(true);
        
        // Simular delay de rede
        await this.delay(1000);
        
        // Validar credenciais
        const user = this.validateCredentials(username, password);
        
        if (user) {
            // Login bem-sucedido
            this.setSuccessState();
            
            // Salvar sessão
            this.saveSession(user);
            
            // Salvar "lembrar de mim" se marcado
            if (this.rememberMeCheckbox.checked) {
                localStorage.setItem('rs_remember', JSON.stringify({ username }));
            } else {
                localStorage.removeItem('rs_remember');
            }
            
            // Redirecionar após animação
            await this.delay(1000);
            this.redirectToDashboard(user.role);
        } else {
            // Login falhou
            this.setLoadingState(false);
            this.showError('Usuário ou senha incorretos');
        }
    }

    validateCredentials(username, password) {
        // Verificar admin
        if (username === USERS_CONFIG.admin.username && password === USERS_CONFIG.admin.password) {
            return USERS_CONFIG.admin;
        }
        
        // Verificar cliente
        if (username === USERS_CONFIG.client.username && password === USERS_CONFIG.client.password) {
            return USERS_CONFIG.client;
        }
        
        return null;
    }

    saveSession(user) {
        const sessionData = {
            username: user.username,
            role: user.role,
            name: user.name,
            email: user.email,
            timestamp: Date.now()
        };
        localStorage.setItem('rs_session', JSON.stringify(sessionData));
    }

    redirectToDashboard(role) {
        // Admin vai para painel administrativo, usuário vai para dashboard
        if (role === 'admin') {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'index.html';
        }
    }

    setLoadingState(loading) {
        if (loading) {
            this.loginBtn.classList.add('loading');
            this.loginBtn.disabled = true;
        } else {
            this.loginBtn.classList.remove('loading');
            this.loginBtn.disabled = false;
        }
    }

    setSuccessState() {
        this.loginBtn.classList.remove('loading');
        this.loginBtn.classList.add('success');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorDiv.classList.add('show');
        
        // Adicionar shake ao formulário
        this.form.classList.add('shake');
        setTimeout(() => this.form.classList.remove('shake'), 500);
    }

    hideError() {
        this.errorDiv.classList.remove('show');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initVisualEffects() {
        // Efeito de foco nos inputs
        const inputs = document.querySelectorAll('.form-group input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }
}

// Funções utilitárias para verificação de autenticação em outras páginas
const Auth = {
    // Verificar se está autenticado
    isAuthenticated() {
        const session = localStorage.getItem('rs_session');
        if (!session) return false;
        
        const sessionData = JSON.parse(session);
        // Verificar validade (24 horas)
        if (Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('rs_session');
            return false;
        }
        return true;
    },

    // Obter dados da sessão
    getSession() {
        const session = localStorage.getItem('rs_session');
        return session ? JSON.parse(session) : null;
    },

    // Verificar se é admin
    isAdmin() {
        const session = this.getSession();
        return session && session.role === 'admin';
    },

    // Verificar se é usuário comum
    isUser() {
        const session = this.getSession();
        return session && session.role === 'user';
    },

    // Logout
    logout() {
        localStorage.removeItem('rs_session');
        window.location.href = 'login.html';
    },

    // Proteger página (redireciona se não autenticado)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Proteger página admin
    requireAdmin() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        if (!this.isAdmin()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Só inicializar na página de login
    if (document.getElementById('loginForm')) {
        new AuthSystem();
    }
});

// Exportar para uso em outras páginas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Auth, USERS_CONFIG };
}
