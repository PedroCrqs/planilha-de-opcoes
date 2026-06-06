# 🏛️ Majesto - Opções Exclusivas para Parceiros

Sistema moderno de listagem de imóveis para corretores parceiros, com interface mobile-first, acessível e preparada para integração com API.

## 📋 Sobre o Projeto

Majesto é uma plataforma de apresentação de opções imobiliárias exclusivas para corretores parceiros. O projeto foi refatorado com foco em:

- **Mobile-First**: Experiência otimizada para smartphones
- **Acessibilidade**: Interface acessível para usuários com diferentes necessidades
- **Simplicidade**: Design limpo e intuitivo
- **Manutenibilidade**: Código bem organizado e documentado
- **Escalabilidade**: Preparado para integração com backend Node.js + SQLite

## 🎯 Público-Alvo

- Corretores de imóveis (maioria 45+ anos)
- Usuários principalmente mobile
- Baixa familiaridade com tecnologia
- Necessidade de encontrar imóveis rapidamente

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── scripts/
│   ├── app.js           # Orquestração principal
│   ├── data.js          # Camada de dados (mock + API)
│   ├── state.js         # Gerenciamento de estado
│   ├── components.js    # Componentes reutilizáveis
│   └── utils.js         # Funções utilitárias
├── styles/
│   ├── variables.css    # Variáveis de design
│   ├── base.css         # Reset e estilos base
│   ├── components.css   # Estilos dos componentes
│   ├── layout.css       # Grid e layout
│   └── responsive.css   # Media queries
└── assets/
    └── images/
        └── logo.png     # Logo Majesto
```

### Camadas da Aplicação

```
┌─────────────────────────────────────────┐
│         UI Layer (Components)           │
│  Header | SearchBar | Filters | Cards   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      State Management Layer              │
│  Data Store | Filter Logic | Rendering  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Data Layer (API Ready)             │
│  Mock Data → API Endpoint (futuro)      │
└─────────────────────────────────────────┘
```

## 🚀 Como Usar

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/planilha-de-opcoes.git
cd planilha-de-opcoes
```

2. Abra `index.html` em um navegador moderno (Chrome, Firefox, Safari, Edge)

### Desenvolvimento

Não há dependências externas! O projeto usa apenas HTML, CSS e JavaScript vanilla.

Para desenvolvimento local, você pode usar um servidor HTTP simples:

```bash
# Python 3
python -m http.server 8000

# Node.js (com http-server)
npx http-server

# PHP
php -S localhost:8000
```

Acesse `http://localhost:8000` no navegador.

## 📱 Funcionalidades

### ✅ Implementadas

- [x] Busca global unificada
- [x] Filtros por bairro
- [x] Filtros por tipo de imóvel (casa, apartamento, cobertura)
- [x] Dashboard com estatísticas
- [x] Cards de imóveis responsivos
- [x] Interface mobile-first
- [x] Acessibilidade (ARIA, semântica HTML)
- [x] Design limpo e moderno
- [x] Fontes grandes para melhor legibilidade
- [x] Botões grandes (48px mínimo)

### 🔄 Preparado para Integração com API

A estrutura está pronta para substituir dados mock por chamadas reais:

```javascript
// Em src/scripts/data.js
async function fetchProperties() {
  // Atualmente retorna dados locais
  // Futuramente:
  const response = await fetch('/api/properties');
  return response.json();
}
```

## 🎨 Design System

### Cores

- **Primária**: Dourado (#D4AF37) - Marca Majesto
- **Fundo**: Branco (#FFFFFF)
- **Texto**: Cinza escuro (#2C2C2C)
- **Destaque**: Dourado claro (#E8D4A0)

### Tipografia

- **Fonte**: System fonts (melhor performance)
- **Tamanho Base**: 16px (mobile) → 18px (desktop)
- **Headings**: 28px (H1), 20px (H2), 16px (H3)

### Espaçamento

- Escala: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px
- Padding padrão: 16px
- Gap entre cards: 16px

## 📊 Estrutura de Dados

### Imóvel (Property)

```javascript
{
  id: 1,
  nome: "Acquabella",
  bairro: "Barra da Tijuca",
  tipologia: "4 quartos",
  valor: 3200000,
  tipo: "casa",
  link: "https://drive.google.com/..."
}
```

### Tipos de Imóvel

- `casa` - Casa
- `apartamento` - Apartamento
- `cobertura` - Cobertura

## 🔧 Desenvolvimento

### Adicionar Novo Imóvel

Em `src/scripts/data.js`, adicione ao array `PROPERTIES_DATA`:

```javascript
{
  id: 90,
  nome: "Novo Imóvel",
  bairro: "Bairro",
  tipologia: "3 quartos",
  valor: 1000000,
  tipo: "apartamento",
  link: "https://drive.google.com/..."
}
```

### Adicionar Novo Filtro

Edite `src/scripts/state.js` e `src/scripts/components.js` para adicionar novos critérios de filtro.

### Customizar Cores

Edite as variáveis em `src/styles/variables.css`:

```css
:root {
  --color-primary: #D4AF37;
  --color-primary-dark: #B8860B;
  /* ... */
}
```

## ♿ Acessibilidade

O projeto segue as diretrizes WCAG 2.1:

- ✅ Semântica HTML5 apropriada
- ✅ Atributos ARIA onde necessário
- ✅ Contraste de cores adequado
- ✅ Fontes legíveis (16px+)
- ✅ Botões com 48px mínimo
- ✅ Suporte a teclado
- ✅ Skip link para conteúdo principal
- ✅ Labels associados a inputs
- ✅ Suporte a leitores de tela

## 📈 Performance

- **Sem dependências externas**: Carregamento rápido
- **CSS modular**: Apenas o necessário é carregado
- **JavaScript otimizado**: Debounce em buscas
- **Imagens otimizadas**: Logo em PNG
- **Lazy loading pronto**: Estrutura preparada

## 🔐 Segurança

- ✅ Escape de HTML para prevenir XSS
- ✅ Validação de entrada
- ✅ Links com `rel="noopener noreferrer"`
- ✅ Sem dados sensíveis no frontend

## 🚀 Integração com Backend

### Próximos Passos

1. **Criar API Node.js + SQLite**
   - Endpoint: `GET /api/properties`
   - Retornar JSON com array de imóveis

2. **Atualizar `fetchProperties()` em `data.js`**
   ```javascript
   async function fetchProperties() {
     const response = await fetch('https://seu-backend.com/api/properties');
     if (!response.ok) throw new Error('Erro ao carregar imóveis');
     return response.json();
   }
   ```

3. **Adicionar autenticação** (se necessário)

4. **Implementar cache** com localStorage

## 📝 Documentação de Código

Cada arquivo possui comentários explicativos:

- `data.js` - Camada de dados
- `state.js` - Gerenciamento de estado
- `components.js` - Componentes UI
- `utils.js` - Funções utilitárias
- `app.js` - Orquestração principal

## 🐛 Troubleshooting

### Imóveis não aparecem
- Verifique se `data.js` está carregado
- Abra o console (F12) e procure por erros

### Filtros não funcionam
- Verifique se `state.js` está carregado
- Limpe o cache do navegador

### Estilos não aplicam
- Verifique se todos os CSS estão linkados no HTML
- Limpe o cache (Ctrl+Shift+R)

## 📄 Licença

Este projeto é de uso exclusivo para Majesto.

## 👨‍💻 Autor

Desenvolvido por [Pedro Cerqueira](https://github.com/PedroCrqs)

Refatoração completa com foco em UX/UI para corretores mobile-first.

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Última atualização**: Maio 2024
**Versão**: 2.0.0 (Refatoração Completa)
