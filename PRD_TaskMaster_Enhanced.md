# PRD — TaskMaster (Versão Aprimorada)

## 1. Resumo Executivo

### Visão Geral do Produto
O **TaskMaster** é uma aplicação web de gestão de tarefas no formato Kanban (semelhante a Trello, Microsoft Planner e Slack). A versão aprimorada adiciona recursos de produtividade e colaboração, mantendo o fluxo principal do quadro já existente.

### Propósito dos Aprimoramentos
Os novos recursos foram adicionados para:
- reduzir esforço manual de planejamento;
- acelerar compartilhamento de contexto entre ferramentas;
- melhorar visibilidade e rastreabilidade do backlog;
- aumentar engajamento com personalização visual.

### Valor de Alto Nível
- **Mais produtividade** com checklist automático por tarefa;
- **Melhor colaboração** com integrações rápidas (Google Calendar e Teams);
- **Maior controle operacional** via exportação CSV;
- **Experiência mais agradável** com background customizável e persistente.

---

## 2. Problema

### Problemas que estão sendo resolvidos
- Criação de tarefas sem detalhamento prático imediato (falta de subtarefas iniciais).
- Dificuldade para compartilhar tarefas com contexto padronizado em ferramentas externas.
- Ausência de mecanismo rápido de exportação de backlog para análises/offline.
- Interface pouco personalizável, reduzindo senso de apropriação do usuário.

### Por que essas funcionalidades são importantes
- Checklist automático reduz tempo entre criação e execução da tarefa.
- Integrações MCP diminuem retrabalho de copiar/colar informações.
- Exportação para CSV suporta governança, auditoria e comunicação com stakeholders.
- Personalização de background melhora experiência de uso e adoção contínua.

---

## 3. Objetivos

### Objetivos de Negócio
- Aumentar adoção de recursos avançados da plataforma.
- Melhorar retenção e frequência de uso do TaskMaster.
- Fortalecer posicionamento como hub leve de gestão de trabalho.

### Objetivos do Usuário
- Criar tarefas com menor fricção.
- Receber sugestão automática de checklist ao criar uma nova tarefa.
- Compartilhar e agendar tarefas em poucos cliques.
- Exportar backlog em formato consumível por planilhas.

### Critérios de Sucesso
- Recursos acessíveis sem treinamento formal.
- Nenhuma regressão no fluxo Kanban existente.
- Aumento de uso de checklist, integrações e exportação.

---

## 4. Usuários-Alvo

### Persona 1 — Colaborador Individual
- **Perfil:** profissional que executa tarefas no dia a dia.
- **Necessidades:** clareza de próximos passos e atualização rápida de progresso.
- **Dores:** quebra manual de tarefas e compartilhamento inconsistente.

### Persona 2 — Líder de Time
- **Perfil:** coordena prioridades e alinhamento do time.
- **Necessidades:** visibilidade do backlog e contexto compartilhável.
- **Dores:** dificuldade em consolidar status e comunicar andamento.

### Persona 3 — PM/Operações
- **Perfil:** responsável por acompanhamento e reporte.
- **Necessidades:** exportação estruturada, rastreabilidade e visão consolidada.
- **Dores:** coleta manual de dados para relatórios.

---

## 5. Histórias de Usuário

1. **Criação de tarefa**  
   Como **colaborador**, eu quero **criar tarefas com título, descrição e prioridade**, para que **o trabalho fique bem definido desde o início**.

2. **Checklist automático**  
   Como **colaborador**, eu quero **receber checklist automático ao criar tarefa**, para que **eu tenha um plano inicial de execução**.

3. **Uso de checklist**  
   Como **colaborador**, eu quero **marcar itens do checklist com checkbox**, para que **eu acompanhe o progresso granular da tarefa**.

4. **Customização de background**  
   Como **usuário**, eu quero **subir uma imagem para personalizar o quadro**, para que **o ambiente de trabalho fique mais agradável e personalizado**.

5. **Google Calendar**  
   Como **usuário**, eu quero **enviar uma tarefa para o Google Calendar com dados pré-preenchidos**, para que **eu consiga agendar atividades rapidamente**.

6. **Microsoft Teams**  
   Como **usuário**, eu quero **copiar um resumo padronizado da tarefa e abrir o Teams**, para que **eu compartilhe o contexto sem retrabalho**.

7. **Exportar backlog**  
   Como **líder/PM**, eu quero **exportar backlog em CSV**, para que **eu possa analisar e reportar o andamento fora da ferramenta**.

---

## 6. Funcionalidades e Requisitos

## Must Have (P0)

### P0.1 — Funcionalidade Kanban Base
**Descrição:** manter fluxo já existente de colunas e transições de tarefas.

**Critérios de Aceite:**
- Quadro mantém comportamento original (sem quebra de funcionalidades existentes).
- Tarefas continuam transitando entre status esperados.

### P0.2 — Geração Automática de Checklist (Skill)
**Descrição:** ao criar tarefa, gerar checklist com base na descrição.

**Critérios de Aceite:**
- Toda nova tarefa recebe checklist automaticamente.
- Checklist é exibido no card com itens marcáveis.
- Itens refletem lógica de geração definida pela skill simulada.

### P0.3 — Integrações MCP

#### a) Google Calendar
**Descrição:** botão por tarefa que abre criação de evento com título e descrição.

**Critérios de Aceite:**
- Botão “Add to Calendar” visível em cada tarefa.
- URL inclui parâmetros de texto e detalhes da tarefa.

#### b) Microsoft Teams
**Descrição:** botão por tarefa que copia resumo e redireciona para Teams.

**Critérios de Aceite:**
- Botão “Share to Teams” visível em cada tarefa.
- Cópia para clipboard com template padronizado.
- Redirecionamento para `https://teams.microsoft.com` após ação.

#### c) Excel (Export CSV)
**Descrição:** botão global para exportar backlog completo.

**Critérios de Aceite:**
- Botão “Export Backlog” disponível globalmente.
- Arquivo CSV com colunas: **Title, Description, Priority, Status**.

### P0.4 — Customização de Background
**Descrição:** upload de imagem para personalizar plano de fundo do board.

**Critérios de Aceite:**
- Botão/controle de upload de imagem funcional.
- Aplicação com `background-size: cover` e `background-position: center`.
- Preferência persistida localmente (localStorage).
- Opção de remover/resetar background.

## Should Have (P1)

### P1.1 — Melhorias de UI
**Descrição:** ajustes de estilo e hierarquia visual para novos controles.

**Critérios de Aceite:**
- Botões consistentes e facilmente identificáveis.
- Novos elementos não poluem a leitura do quadro.

### P1.2 — Melhor Visualização de Tarefa
**Descrição:** destacar contexto da tarefa (descrição/checklist/prioridade).

**Critérios de Aceite:**
- Leitura rápida do estado e detalhes da tarefa.
- Boa usabilidade em diferentes tamanhos de tela.

---

## 7. Fluxo do Usuário

1. Usuário acessa o TaskMaster.
2. Cria uma nova tarefa (título, descrição, prioridade).
3. Sistema gera checklist automaticamente com base na descrição.
4. Usuário visualiza tarefa no quadro com checklist e ações MCP.
5. Usuário pode:
   - personalizar o background;
   - adicionar a tarefa ao Google Calendar;
   - compartilhar a tarefa via Teams;
   - exportar backlog em CSV.
6. Usuário acompanha progresso marcando checklist e movendo tarefa de status.
7. Tarefa é concluída no fluxo Kanban existente.

---

## 8. Requisitos Técnicos

### Tecnologias
- **HTML** para estrutura adicional de UI.
- **CSS** para estilos novos e não intrusivos.
- **JavaScript Vanilla** para comportamento, eventos e integrações via browser APIs.

### Persistência
- Uso de **localStorage** para:
  - imagem de background customizado;
  - preferências locais relacionadas a checklist (quando aplicável).

### Estratégia de Integração Frontend
- Manipulação de DOM com `querySelector`, `addEventListener` e `MutationObserver`.
- Injeção não intrusiva de botões e componentes após carregamento da página.

### Integrações via URL e APIs do Navegador
- Google Calendar via URL template com query params.
- Teams via `navigator.clipboard` + redirecionamento web.
- Exportação CSV gerada dinamicamente em JavaScript com download no cliente.

---

## 9. Requisitos Não Funcionais

### Performance
- Scripts adicionais não devem impactar perceptivelmente o carregamento inicial.
- Interações de botões devem responder em tempo próximo do instantâneo.

### Usabilidade
- Ações com rótulos claros e autoexplicativos.
- Curva de aprendizagem mínima para recursos novos.

### Responsividade
- Recursos utilizáveis em desktop e tablet.
- Layout preservado sem sobreposição crítica de controles.

### Manutenibilidade
- Código modularizado por responsabilidade (feature integration, skill, estilos).
- Comentários claros sobre estratégia de integração.

---

## 10. Restrições

- Não alterar backend Python (escopo de evolução frontend aditiva).
- Não modificar fluxo existente de regras do Kanban.
- Não sobrescrever funções existentes do projeto.
- Não usar frameworks frontend (React/Vue/etc.).
- Implementar somente com HTML, CSS e JavaScript.

---

## 11. Métricas de Sucesso

### Eficiência e Resultado
- Taxa de conclusão de tarefas.
- Tempo médio entre criação da tarefa e primeira ação executada.

### Adoção de Funcionalidades
- % de tarefas com checklist gerado e utilizado.
- % de uso de “Add to Calendar”.
- % de uso de “Share to Teams”.
- % de uso de “Export Backlog”.
- % de usuários que customizam background.

### Engajamento
- Frequência de uso semanal/mensal.
- Número médio de interações por sessão.

---

## 12. Melhorias Futuras

- **Drag and Drop avançado** com ordenação refinada entre cards.
- **Integrações reais via API** (Calendar/Teams) com autenticação e confirmação de sucesso.
- **Autenticação de usuários** e preferências por perfil.
- **Checklist inteligente v2** com modelos por tipo de tarefa/domínio.
- **Painel analítico** com métricas de produtividade e adoção de funcionalidades.

---

## Conclusão

A versão aprimorada do TaskMaster agrega valor direto ao fluxo de trabalho ao combinar planejamento automático (checklist), colaboração (MCP), portabilidade de dados (CSV) e personalização visual (background). O desenho do escopo prioriza evolução incremental, baixo risco de regressão e alta usabilidade para usuários finais e stakeholders.
