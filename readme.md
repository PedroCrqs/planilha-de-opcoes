# Majesto — Opções Exclusivas para Parceiros

Plataforma de listagem de imóveis para corretores parceiros. Interface mobile-first com backend Node.js + SQLite e entrega via Cloudflare Tunnel.

---

## Arquitetura

```
majesto-parcerias.com.br
        │
  Cloudflare Tunnel (HTTPS)
        │
  server.js (Express :3000)
        │
   ┌────┴────┐
   │         │
public/   imoveis.db
(static)  (SQLite)
```

### Stack

| Camada | Tecnologia |
|---|---|
| Servidor | Node.js + Express |
| Banco de dados | SQLite via better-sqlite3 |
| Fotos | Google Drive API v3 |
| Exposição pública | Cloudflare Tunnel |
| Processo | PM2 |

---

## Estrutura de Pastas

```
planilha-de-opcoes/
├── server.js                          # Servidor Express + rotas da API
├── package.json
├── .gitignore
├── CHANGELOG.md
└── public/                            # Arquivos servidos ao browser
    ├── index.html
    └── src/
        ├── scripts/
        │   ├── data.js                # Fetch da API + transformação
        │   ├── state.js               # Gerenciamento de estado e filtros
        │   ├── components.js          # Componentes UI + carousel de fotos
        │   ├── utils.js               # Funções utilitárias
        │   └── app.js                 # Orquestração principal
        ├── styles/
        │   ├── variables.css          # Design tokens
        │   ├── base.css               # Reset e tipografia
        │   ├── components.css         # Estilos dos componentes
        │   ├── layout.css             # Grid e layout
        │   └── responsive.css         # Media queries
        └── assets/
            └── images/
                └── logo.png
```

---

## API

### `GET /api/imoveis`

Retorna todos os imóveis com `ImovelStatus = 'Disponível'`, ordenados por bairro e nome.

**Resposta:**
```json
[
  {
    "ImovelID": 1,
    "NomeImovel": "Acquabella",
    "Bairro": "Barra Da Tijuca",
    "Valor": 3200000,
    "Tipologia": "Apartamento",
    "Quartos": 4,
    "LinkPublico": "https://drive.google.com/..."
  }
]
```

### `GET /api/imoveis/:id/fotos`

Busca as fotos do imóvel diretamente na pasta do Google Drive via API. Resultado cacheado em memória por sessão.

**Resposta:**
```json
[
  "https://drive.google.com/thumbnail?id=FILE_ID&sz=w1200"
]
```

---

## Schema do Banco

```sql
Imoveis         -- dados principais, status, valor, tipologia
Bairros         -- nome e zona (Oeste, Sul, Norte, Sudoeste)
Condominios     -- nome, endereço, infraestrutura
Fotos           -- caminho local das imagens
Auditoria       -- log automático de INSERT e UPDATE via triggers
```

`ImovelStatus` aceita: `Disponível`, `Vendido`, `Alugado`, `Retirado de Venda`.  
Imóveis fora de `Disponível` são excluídos automaticamente da API.

---

## Como rodar localmente

```bash
git clone https://github.com/PedroCrqs/planilha-de-opcoes.git
cd planilha-de-opcoes
npm install
node server.js
```

Acesse `http://localhost:3000`.

O arquivo `imoveis.db` deve estar em `../imoveis-database/data/imoveis.db` em relação ao projeto, ou ajuste o caminho em `server.js`.

---

## Deploy (produção)

O servidor roda numa máquina local com Linux Debian 12, exposta via Cloudflare Tunnel sem abertura de portas no roteador.

```bash
# Subir o servidor com PM2
pm2 start server.js --name planilha-de-opcoes
pm2 save
pm2 startup

# Tunnel como serviço systemd
sudo /usr/local/bin/cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

Configuração do tunnel em `/etc/cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /home/pedrocrqs/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: majesto-parcerias.com.br
    service: http://localhost:3000
  - service: http_status:404
```

---

## Funcionalidades

- Busca global com debounce (nome, bairro, tipo, valor, quartos)
- Filtros rápidos por tipo (Casa, Apartamento, Cobertura) e quantidade de quartos
- Ordenação por destaque, menor valor, maior valor e nome A-Z
- Carousel de fotos carregadas diretamente do Google Drive
- Cache de fotos em memória por sessão
- Interface mobile-first, acessível (ARIA, semântica HTML5, contraste WCAG 2.1)
- Imóveis indisponíveis removidos automaticamente pela API

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta do servidor |

O caminho do banco e a chave do Google Drive estão configurados diretamente em `server.js`. Em produção, considere movê-los para um `.env`.

---

## Git Flow

```
feature/*  →  refactor/*
                  │
                 dev      ← testes e tags de versão
                  │
                main      ← produção
```

---

## Créditos

Desenvolvido por [Pedro Cerqueira](https://github.com/PedroCrqs).

O frontend da versão 2.0 — interface, design system, componentes, acessibilidade e arquitetura de estado — foi inteiramente criado por [Karla Renata](https://github.com/karlarenatadev). Um trabalho cuidadoso, mobile-first e pensado para o público certo. Obrigado, Karla.
