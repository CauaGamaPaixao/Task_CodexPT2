# TaskMaster Kanban + MCP Integrations

Projeto Kanban em Streamlit com camada de integrações MCP modular (Node.js/Express).

## Estrutura

```text
.
├── controllers
│   ├── aiController.js
│   └── integrationController.js
├── routes
│   ├── aiRoutes.js
│   └── integrationRoutes.js
├── services
│   ├── aiService.js
│   ├── externalDataService.js
│   ├── githubService.js
│   ├── userService.js
│   └── webhookService.js
├── kanban_data.json
├── package.json
├── server.js
└── taskmaster.py
```

## Como rodar

### 1) Subir servidor MCP (Node)

```bash
npm install
npm start
```

Servidor sobe em `http://localhost:3001`.

### 2) Subir frontend (Streamlit)

```bash
streamlit run taskmaster.py
```

## Variáveis de ambiente opcionais

- `MCP_API_URL` (default: `http://localhost:3001`)
- `WEBHOOK_URL` (se ausente, envio de webhook é simulado)
- `GITHUB_TOKEN` (opcional para chamadas GitHub com maior limite)
- `USERS_API_URL` (opcional para trocar endpoint da API externa de usuários)

## Endpoints MCP

- `POST /ai/generate-subtasks`
  - body: `{ "taskTitle": "string" }`
  - resposta: `["Subtask 1", "Subtask 2", "Subtask 3"]`

- `GET /integrations/github/pr?url=<github-pr-url>`
  - retorno com metadados da PR

- `POST /integrations/events/task`
  - body: `{ "event": "task_created", "taskTitle": "...", "status": "Pending" }`

- `GET /integrations/activities`
  - retorna logs locais em `integration_logs.json`

- `GET /integrations/users`
  - retorna lista de usuários da API externa para associação em tasks

## Fluxo integrado no frontend

- Nova task pode incluir link de PR GitHub e assignee.
- Botão `Check PR details` consulta o MCP GitHub.
- Botão `Gerar subtasks` chama `POST /ai/generate-subtasks` e salva resultado no card.
- Eventos de criação/movimentação/conclusão/exclusão de task disparam webhook + log externo.
