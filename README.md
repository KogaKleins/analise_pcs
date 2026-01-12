# RS Contabilidade - Análise de Computadores

Site profissional para apresentação de análise de computadores da RS Contabilidade.

## 🚀 Funcionalidades

- **Dashboard Principal**: Cards interativos com todos os 15 computadores
- **Filtros**: Por status (Bom Estado, Atenção, Crítico) e busca por nome/setor
- **Modal de Detalhes**: Especificações completas de cada PC
- **Relatórios**: Página dedicada com links para relatórios e documentos
- **Sugestões de Compra**: Recomendações de upgrades e orçamentos
- **Contato**: Formulário e informações de contato

## 🎨 Design

- Tema vermelho bordô profissional
- Efeitos Glassmorphism modernos
- Animações suaves
- 100% responsivo (mobile-first)
- Partículas decorativas no fundo

## 📁 Estrutura

```
analise_PCs/
├── index.html              # Página principal
├── vercel.json             # Config para deploy
├── css/
│   ├── main.css           # Estilos principais
│   ├── components.css     # Cards, modal, botões
│   ├── animations.css     # Animações e efeitos
│   └── pages.css          # Estilos das páginas internas
├── js/
│   ├── data.js            # Dados dos 15 computadores
│   ├── main.js            # Lógica principal
│   └── particles.js       # Sistema de partículas
├── pages/
│   ├── relatorios.html    # Página de relatórios
│   ├── sugestoes.html     # Sugestões de compra
│   └── contato.html       # Página de contato
└── assets/                # Imagens e recursos
```

## ⚙️ Como Editar os Dados dos PCs

Edite o arquivo `js/data.js`. Cada PC tem esta estrutura:

```javascript
{
    id: 1,
    nome: "PC-01",
    usuario: "Nome do Usuário",
    setor: "Setor",
    status: "ok", // ok, atencao, critico
    specs: {
        ram: {
            total: "8 GB",
            tipo: "DDR4",
            detalhe: "Dual Channel"
        },
        armazenamento: {
            tipo: "SSD SATA",
            capacidade: "447 GB",
            usado: "180 GB"
        },
        processador: {
            modelo: "Intel Core i5",
            geracao: "6ª Geração",
            nucleos: "4 núcleos",
            frequencia: "3.19 GHz"
        },
        sistemaOperacional: "Windows 10 Pro",
        placaMae: "-",
        gpu: "Intel HD Graphics 530"
    },
    observacoes: "Descrição do estado...",
    recomendacoes: [
        "Recomendação 1",
        "Recomendação 2"
    ],
    links: {
        relatorio: "URL do relatório PDF",
        compraRam: "URL para comprar RAM",
        compraSSD: "URL para comprar SSD",
        compraProcessador: "URL para comprar processador"
    }
}
```

## 🌐 Deploy no Vercel

### Opção 1: Via CLI

1. Instale o Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Na pasta do projeto, execute:
   ```bash
   vercel
   ```

3. Siga as instruções na tela

### Opção 2: Via GitHub

1. Faça upload do projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Importe o repositório
5. Clique em "Deploy"

## 📝 Personalizações

### Alterar informações de contato:
- Edite os arquivos HTML (index.html e páginas em /pages)
- Busque por "contato@rscontabilidade.com" e "(XX) XXXXX-XXXX"

### Alterar cores do tema:
- Edite `css/main.css`
- Modifique as variáveis CSS no `:root`

### Adicionar links de compra:
- Edite `js/data.js`
- Preencha os campos dentro de `links: {}`

## 📱 Responsividade

O site é totalmente responsivo:
- Desktop: Layout completo com grid de cards
- Tablet: Adaptações de layout
- Mobile: Menu hamburguer, cards em coluna única

---

Desenvolvido para **RS Contabilidade** | 2026
