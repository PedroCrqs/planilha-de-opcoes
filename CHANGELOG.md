# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [2.1.0] - 2026-06-23

### Adicionado
- Rota `GET /api/imoveis/:id/fotos` para busca de fotos via Google Drive API v3
- Cache de fotos em memória (`Map`) por sessão do servidor
- Integração com `googleapis` para autenticação via Service Account
- Utilitário `extractFolderId` para extrair o ID da pasta a partir do `LinkPublico`

### Alterado
- `data.js` migrado de dados estáticos para consumo da rota `GET /api/imoveis`
- Nomes dos imóveis padronizados em Title Case via `toTitleCase()`
- Prefixo `Casa -` e `Cobertura -` adicionados ao nome conforme coluna `Tipologia` do banco
- Tipo do imóvel (`tipo`) derivado da coluna `Tipologia` em vez de inferido pelo nome
- `link` passa a ser `null` quando ausente, em vez de `"#"`
- `components.js` atualizado para consumir a rota de fotos e renderizar carousel

### Removido
- Array `rawProperties` e dados hardcoded de `data.js`
- Funções `inferPropertyType`, `getBedroomCount` e constante `PROPERTIES`

---

## [2.0.0] - 2026-06-23

### Adicionado
- Interface completamente redesenhada pela desenvolvedora Karla Renata
- Design system com tokens em `variables.css` (cores, tipografia, espaçamento, sombras)
- Componentes reutilizáveis em `components.js` (cards, filtros, estatísticas, placeholders)
- Gerenciamento de estado centralizado em `state.js` com padrão observer
- Busca global com debounce de 250ms cobrindo nome, bairro, tipo, valor e quartos
- Filtros rápidos por tipo de imóvel e quantidade de quartos
- Ordenação por destaque, menor valor, maior valor e nome A-Z
- Estatísticas dinâmicas de resultados filtrados vs. total
- Interface mobile-first com breakpoints em 640px, 760px e 1100px
- Acessibilidade completa: ARIA, semântica HTML5, skip link, contraste WCAG 2.1
- Suporte a `prefers-reduced-motion`
- `utils.js` com debounce, throttle, normalização de texto e formatação de moeda
- Carousel de imagens nos cards com navegação por botões e contador de fotos

### Alterado
- Estrutura de pastas reorganizada: arquivos estáticos movidos para `public/`
- CSS dividido em módulos: `variables`, `base`, `components`, `layout`, `responsive`
- `index.html` reescrito com header, hero, seção de busca, filtros e footer semânticos

### Removido
- Tabela HTML (`<table>`) substituída por grid de cards
- `script.js` da v1 (filtro de tabela) substituído pela arquitetura de estado
- Estilos monolíticos de `style.css` da v1

---

## [1.0.0] - 2026-06-22

### Adicionado
- Servidor Node.js com Express expondo `GET /api/imoveis`
- Conexão com SQLite via `better-sqlite3`
- Query com `INNER JOIN` em `Bairros` e `LEFT JOIN` em `Condominios`
- Filtro automático por `ImovelStatus = 'Disponível'`
- Ordenação por bairro e nome do condomínio definida no backend
- Arquivos estáticos servidos pelo Express a partir de `/public`
- Deploy via Cloudflare Tunnel com domínio `majesto-parcerias.com.br`
- Processo gerenciado por PM2 com startup automático via systemd

### Alterado
- Dados da planilha migrados do HTML estático para banco de dados SQLite
- Tabela renderizada dinamicamente via `fetch()` no frontend
- Valor dos imóveis formatado em BRL via `toLocaleString`

### Removido
- Linhas `<tr>` hardcoded do `index.html`
