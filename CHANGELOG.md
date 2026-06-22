# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.0.0] - 2025-06-22

### Alterado
- Dados da planilha migrados do HTML estático para banco de dados SQLite
- Tabela agora é renderizada dinamicamente via `fetch()` no frontend
- Imóveis indisponíveis (vendidos, alugados, retirados) são excluídos automaticamente pela API
- Ordenação da tabela por bairro e nome do imóvel definida no backend

### Adicionado
- Servidor Node.js com Express expondo a rota `GET /api/imoveis`
- Integração com SQLite via `better-sqlite3`
- Query com `INNER JOIN` em `Bairros` e `LEFT JOIN` em `Condominios`
- Arquivos estáticos servidos pelo próprio Express a partir de `/public`
- Valor dos imóveis formatado em `BRL` via `toLocaleString`

### Removido
- Linhas `<tr>` hardcoded do `index.html`
