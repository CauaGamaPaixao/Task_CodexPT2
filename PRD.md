# PRD — TaskMaster (Kanban Web App em Python)

## 1. Visão Geral do Produto

**Nome do produto:** TaskMaster  
**Tipo:** Aplicação web de gerenciamento de tarefas no modelo Kanban  
**Referências conceituais:** Trello / Microsoft Planner  
**Stack de Front-end:** Python (Streamlit)

O TaskMaster permite organizar atividades em colunas de fluxo de trabalho, acompanhar progresso e priorização de tarefas, além de suportar personalização visual e integrações externas.

---

## 2. Objetivo do Produto

Entregar uma aplicação simples e eficiente para gestão de tarefas com foco em:

- visualização clara do fluxo de trabalho;
- movimentação rápida de cards entre etapas;
- priorização de atividades;
- possibilidade de evolução com integrações (MCP) e recursos assistidos por IA.

---

## 3. Escopo

### 3.1 Escopo In

1. **Board Kanban com colunas dinâmicas**
   - Pending
   - In Progress
   - Finished

2. **Cards com dados obrigatórios**
   - Atividade (título/descrição curta da tarefa)
   - Prioridade (High, Medium, Low)

3. **Operações principais de tarefa**
   - Criar tarefa
   - Mover tarefa entre colunas
   - Concluir tarefa
   - Excluir tarefa concluída

4. **Persistência local de dados**
   - Armazenamento em arquivo JSON local

5. **Modificadores de GUI**
   - Upload de imagem local para fundo do board

6. **Integrações MCP (camada separada de serviços)**
   - GitHub (consulta de PR)
   - Slack (notificações de eventos)
   - Serviço externo de logs/atividade

7. **Skill externa de IA**
   - Geração de subtasks via endpoint dedicado

### 3.2 Escopo Out (fase futura)

- autenticação/autorização de usuários;
- colaboração em tempo real multiusuário;
- comentários, anexos e checklists avançados por card;
- filtros avançados e relatórios analíticos.

---

## 4. Público-Alvo

- Profissionais e estudantes que precisam organizar tarefas pessoais ou de equipe pequena.
- Times de desenvolvimento que querem fluxo visual simples com baixa configuração.

---

## 5. Problemas que o Produto Resolve

- Falta de clareza sobre status das tarefas.
- Dificuldade para priorizar atividades no dia a dia.
- Ausência de um fluxo enxuto para acompanhar execução do trabalho.

---

## 6. Requisitos Funcionais

### RF-01 — Criar tarefa
- O sistema deve permitir criar uma tarefa informando:
  - atividade (obrigatório);
  - prioridade (obrigatório).
- A tarefa criada deve iniciar em **Pending**.

### RF-02 — Exibir board Kanban
- O sistema deve exibir colunas de fluxo:
  - Pending;
  - In Progress;
  - Finished.
- As colunas devem suportar renderização dinâmica a partir de configuração/estado.

### RF-03 — Mover tarefa no fluxo
- A tarefa deve poder avançar de:
  - Pending → In Progress;
  - In Progress → Finished.

### RF-04 — Excluir tarefa concluída
- Tarefas em **Finished** podem ser removidas permanentemente.

### RF-05 — Prioridade visual
- A prioridade da tarefa deve ficar visível no card e possuir diferenciação visual (indicador por cor).

### RF-06 — Persistência
- Alterações no board devem ser persistidas localmente para manter estado entre execuções.

### RF-07 — Modificador de fundo do board
- O usuário deve poder selecionar uma imagem do computador para aplicar como fundo do quadro.
- Deve haver ação para remover o fundo e retornar ao padrão.

### RF-08 — Integração MCP GitHub
- Deve existir serviço para consultar detalhes de PR por URL.
- O usuário pode associar URL de PR à tarefa.

### RF-09 — Integração MCP Slack
- Eventos de tarefa devem gerar notificação:
  - criação;
  - movimentação;
  - conclusão;
  - exclusão.

### RF-10 — Integração externa de dados
- Eventos devem ser registrados em serviço externo/simulado para auditoria de atividades.

### RF-11 — Skill IA para subtasks
- Endpoint `POST /ai/generate-subtasks` deve receber `taskTitle`.
- Deve retornar lista de subtasks sugeridas.
- Front-end deve permitir acionar geração e exibir subtasks no card.

---

## 7. Requisitos Não Funcionais

### RNF-01 — Usabilidade
- Interface simples, com baixa curva de aprendizado.

### RNF-02 — Performance
- Operações comuns (criar/mover/excluir) devem ocorrer com resposta imediata percebida no front-end.

### RNF-03 — Manutenibilidade
- Código organizado em camadas modulares (services/controllers/routes para integrações).

### RNF-04 — Compatibilidade
- Front-end executável em ambiente Python com Streamlit.

### RNF-05 — Segurança mínima
- Tokens e webhooks devem ser lidos via variáveis de ambiente.

---

## 8. Arquitetura de Alto Nível

### 8.1 Front-end (Python)
- Aplicação Streamlit com:
  - renderização do board;
  - formulários de criação;
  - ações por card;
  - consumo de endpoints MCP.

### 8.2 Camada MCP (Node/Express)
- **services/**: regras de integração externa (GitHub, Slack, IA, logs).
- **controllers/**: orquestração de entrada/saída HTTP.
- **routes/**: definição de endpoints.

### 8.3 Persistência
- Board principal em JSON local.
- Logs de integração em JSON dedicado.

---

## 9. Endpoints da Camada MCP

1. `POST /ai/generate-subtasks`
   - Entrada:
     ```json
     { "taskTitle": "string" }
     ```
   - Saída:
     ```json
     ["Subtask 1", "Subtask 2", "Subtask 3"]
     ```

2. `GET /integrations/github/pr?url=<pr_url>`
   - Retorna dados essenciais da Pull Request.

3. `POST /integrations/events/task`
   - Recebe evento de ciclo de vida da task e dispara notificação/log.

4. `GET /integrations/activities`
   - Retorna histórico de atividades integradas.

---

## 10. Fluxos Principais de Usuário

### Fluxo A — Criar e priorizar tarefa
1. Usuário abre formulário lateral.
2. Informa atividade.
3. Define prioridade.
4. Submete tarefa.
5. Card aparece em Pending.

### Fluxo B — Executar tarefa
1. Usuário move card para In Progress.
2. Finaliza e move para Finished.
3. Opcionalmente remove card concluído.

### Fluxo C — Gerar subtasks com IA
1. Usuário clica em “Gerar subtasks” no card.
2. Front-end chama endpoint de IA.
3. Subtasks retornam e são exibidas no card.

### Fluxo D — Associar PR e consultar status
1. Usuário informa URL de PR na criação/edição da tarefa.
2. Clica em consultar detalhes.
3. Sistema mostra metadados da PR.

---

## 11. Regras de Negócio

- Toda tarefa deve ter atividade e prioridade.
- Prioridade aceita apenas valores válidos (High/Medium/Low).
- Fluxo padrão é progressivo (Pending → In Progress → Finished).
- Exclusão direta é permitida somente para tarefas em Finished.

---

## 12. Métricas de Sucesso

- Tempo médio para criar tarefa < 10 segundos.
- % de tarefas com prioridade definida = 100%.
- Taxa de sucesso em movimentação de cards sem erro > 99%.
- Tempo de resposta percebido para ações de card < 1 segundo (ambiente local).

---

## 13. Critérios de Aceite (MVP)

1. Board funcional com colunas Pending, In Progress e Finished.
2. Criação/movimentação/exclusão de tarefas funcionando.
3. Cards exibindo atividade e prioridade corretamente.
4. Persistência local mantendo estado após rerun.
5. Upload de fundo aplicado ao board com opção de remoção.
6. Endpoint de IA retornando subtasks e integração ativa no front-end.
7. Eventos de task enviados para camada de integração e logados.

---

## 14. Riscos e Mitigações

- **Risco:** indisponibilidade de APIs externas (GitHub/Slack/IA).  
  **Mitigação:** fallback local e tratamento de exceções.

- **Risco:** limites de rate da API do GitHub.  
  **Mitigação:** suporte a token opcional via ambiente.

- **Risco:** crescimento de arquivos JSON locais.  
  **Mitigação:** política futura de rotação/limpeza de logs.

---

## 15. Roadmap Sugerido

1. **MVP (atual):** Kanban core + prioridade + persistência + integrações básicas + IA de subtasks.
2. **Próxima fase:** edição de cards, filtros e busca.
3. **Fase colaborativa:** autenticação, multiusuário e tempo real.
4. **Fase analítica:** dashboards e indicadores de produtividade.
