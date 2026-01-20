# 🖥️ Sistema de Análise de Equipamentos

Sistema web profissional para gerenciamento e análise de computadores com **Sistema de Temas Dinâmico**.

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Status](https://img.shields.io/badge/status-Production-green.svg)

**Desenvolvido por:** Wilmar Izequiel Kleinschmidt  
**Email:** kogakleinscleins@gmail.com  
**Telefone:** (48) 99185-0299

---

## ✨ Novidades v2.1.0

- ✅ **Login Redesenhado**: Imagem de fundo visível com animação zoom
- ✅ **Menu Mobile Fullscreen**: Animações staggered e touch-friendly
- ✅ **Relatórios Funcionais**: Geração de PDF, CSV e relatórios individuais
- ✅ **Orçamento Dinâmico**: Cálculo automático baseado em equipamentos
- ✅ **Melhor Acessibilidade**: ARIA labels, focus states, reduced-motion
- ✅ **Performance Otimizada**: Preload de recursos, skeleton loading
- ✅ **Multi-Cliente**: Suporte a múltiplos clientes com dados isolados

---

## 🎨 Sistema de Temas

O sistema possui dois temas visuais:

### 🔵 Tema Padrão - Azul Glass (Moderno)
- Cores: Azul profissional (#2563EB) com detalhes em ciano
- Visual: Glassmorphism moderno e clean
- Usado por: Admin e usuários gerais

### 🔴 Tema RS Contabilidade - Vermelho Bordô
- Cores: Vermelho bordô (#8B0000) com detalhes dourados
- Visual: Elegante e corporativo
- Usado por: Usuários "RS contabilidade"

**O tema é aplicado automaticamente baseado no usuário logado!**

---

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- **Login seguro** com dois níveis de acesso
- **Admin**: Acesso completo ao painel administrativo
- **Usuário**: Visualização apenas
- Sessão persistente com expiração de 24h

### 📊 Dashboard Principal
- Cards interativos com efeito 3D tilt
- Filtros por status (Bom Estado, Atenção, Crítico)
- Busca por nome, usuário ou setor
- Estatísticas em tempo real
- Skeleton loading durante carregamento

### ⚙️ Painel Administrativo (Admin)
- **CRUD de Equipamentos**: Criar, editar, excluir computadores
- **Gerenciamento de Links**: Links de compra para upgrades
- **Configurações**: Personalização do sistema
- **Exportar/Importar**: Backup em JSON

### 📈 Relatórios e Sugestões
- **Relatório Completo em PDF**: Todos os equipamentos
- **Resumo Executivo**: Visão gerencial
- **Exportação CSV**: Para Excel/planilhas
- **Relatórios Individuais**: Por equipamento
- **Orçamento Estimado**: Cálculo automático de upgrades

### 🏢 Sistema Multi-Cliente
- Gerenciamento de múltiplos clientes
- Dados isolados por cliente
- Temas personalizados por cliente

## 🔐 Credenciais de Acesso

### Administrador
- **Usuário:** `WIlmarkogakleins`
- **Senha:** `WILMARkk793!!@#..77ISSO`

### Cliente (RS Contabilidade)
- **Usuário:** `RS contabilidade`
- **Senha:** `Rs3434-4099!@@#equipamentos??`

## 🎨 Design & UX

- **Sistema de Temas Dinâmico** (Azul padrão, Vermelho para RS)
- **Imagem de fundo** com zoom animado e blur controlado
- **Glassmorphism** moderno com backdrop-filter
- **Microinterações**: Ripple, magnetic buttons, 3D tilt
- **100% Responsivo** (mobile-first approach)
- **Menu Mobile Fullscreen** com animações staggered
- **Partículas temáticas** e luzes ambiente
- **Skeleton Loading** para feedback visual
- **Toast Notifications** para feedback de ações
- **Acessibilidade WCAG**: Focus states, ARIA labels, reduced-motion

## 📁 Estrutura do Projeto

```
analise_PCs/
├── index.html              # Dashboard principal
├── login.html              # Página de autenticação
├── vercel.json             # Config para deploy
├── README.md               # Documentação
├── css/
│   ├── themes.css         # 🆕 Sistema de temas (variáveis)
│   ├── main.css           # Estilos principais
│   ├── components.css     # Cards, modal, botões
│   ├── animations.css     # Animações e efeitos
│   ├── auth.css           # Estilos de autenticação
│   ├── admin.css          # Estilos do painel admin
│   ├── interactions.css   # Microinterações
│   └── pages.css          # Estilos das páginas internas
├── js/
│   ├── theme.js           # 🆕 Gerenciador de temas
│   ├── auth.js            # Sistema de autenticação
│   ├── storage.js         # Gerenciamento de dados
│   ├── admin.js           # Lógica do painel admin
│   ├── app.js             # Lógica principal
│   ├── utils.js           # Funções utilitárias
│   ├── components.js      # Componentes reutilizáveis
│   ├── interactions.js    # Microinterações
│   └── particles.js       # Sistema de partículas temáticas
├── imagens/
│   └── imagem.jpg         # Imagem de fundo (desfocada)
└── pages/
    ├── admin.html         # Painel administrativo
    ├── relatorios.html    # Página de relatórios
    └── sugestoes.html     # Sugestões de compra
```

## 💾 Sistema de Dados

Os dados são armazenados em **localStorage** com estrutura preparada para migração futura para banco de dados.

### Estrutura de Equipamento:
```javascript
{
    id: "unique_id",
    nome: "PC-01",
    usuario: "Nome do Usuário",
    setor: "Contabilidade",
    status: "bom", // bom, atencao, critico
    processador: "Intel Core i5-10400",
    cpuScore: 75,
    ram: "8GB DDR4",
    ramScore: 50,
    storage: "SSD 256GB",
    storageScore: 80,
    gpu: "Intel UHD 630",
    so: "Windows 11 Pro",
    observacoes: "Texto de observações",
    recomendacoes: "Texto de recomendações"
}
```

### Exportar/Importar Dados
1. Acesse o **Painel Administrativo** como admin
2. Vá na aba **Exportar/Importar**
3. Clique em **Exportar JSON** para backup
4. Use **Importar JSON** para restaurar dados

## 🌐 Deploy no Vercel

### Via GitHub (Recomendado)

1. Faça push para seu repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Clique em **Deploy**

### Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Na pasta do projeto
vercel

# Para produção
vercel --prod
```

## 📝 Licença

Projeto desenvolvido exclusivamente para RS Contabilidade.

---

## 📋 Changelog

### v2.1.0 (Janeiro 2025)
- Melhorias de performance com preload de recursos
- Meta tags SEO otimizadas
- Acessibilidade WCAG melhorada
- Skeleton loading aprimorado

### v2.0.0 (Janeiro 2025)
- Login redesenhado com imagem de fundo visível
- Menu mobile fullscreen com animações
- Sistema de relatórios funcional (PDF/CSV)
- Orçamento dinâmico por equipamento
- Sistema multi-cliente
- Remoção de dados mockup
- Correção de anos hardcoded

### v1.0.0 (Dezembro 2024)
- Release inicial
- Sistema de temas dinâmico
- Autenticação com roles
- Dashboard com filtros
- Painel administrativo

---

© 2025 - Desenvolvido por **Wilmar Izequiel Kleinschmidt**
