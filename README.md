# Sistema de Análise de Equipamentos

Sistema web profissional para gerenciamento e análise de computadores com **Sistema de Temas Dinâmico**.

**Desenvolvido por:** Wilmar Izequiel Kleinschmidt  
**Email:** kogakleinscleins@gmail.com  
**Telefone:** (48) 99185-0299

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

### Sistema de Autenticação
- **Login seguro** com dois níveis de acesso
- **Admin**: Acesso completo ao painel administrativo
- **Usuário**: Visualização apenas

### Dashboard Principal
- Cards interativos com todos os equipamentos
- Filtros por status (Bom Estado, Atenção, Crítico)
- Busca por nome, usuário ou setor
- Estatísticas em tempo real

### Painel Administrativo (Admin)
- **CRUD de Equipamentos**: Criar, editar, excluir computadores
- **Gerenciamento de Links**: Links de compra para upgrades
- **Configurações**: Personalização do sistema
- **Exportar/Importar**: Backup em JSON

### Relatórios e Sugestões
- Relatórios individuais por equipamento
- Sugestões de upgrade priorizadas
- Links diretos para compra

## 🔐 Credenciais de Acesso

### Administrador
- **Usuário:** `WIlmarkogakleins`
- **Senha:** `WILMARkk793!!@#..77ISSO`

### Cliente (RS Contabilidade)
- **Usuário:** `RS contabilidade`
- **Senha:** `Rs3434-4099!@@#equipamentos??`

## 🎨 Design

- **Sistema de Temas Dinâmico** (Azul padrão, Vermelho para RS)
- **Imagem de fundo desfocada** para efeito premium
- Efeitos Glassmorphism modernos
- Animações suaves e partículas temáticas
- 100% responsivo (mobile-first)
- Luzes ambiente dinâmicas

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

© 2026 - Desenvolvido por **Wilmar Izequiel Kleinschmidt**
