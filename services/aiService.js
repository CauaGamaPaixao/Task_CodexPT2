function buildLocalSubtasks(taskTitle) {
  return [
    `Definir escopo de: ${taskTitle}`,
    `Implementar etapa principal de: ${taskTitle}`,
    `Validar e revisar: ${taskTitle}`,
  ];
}

async function generateSubtasks(taskTitle) {
  const endpoint = process.env.AI_SUBTASKS_API_URL;

  if (!endpoint) {
    return buildLocalSubtasks(taskTitle);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskTitle }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha na API de IA externa (${response.status}): ${body}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.subtasks)) {
    return payload.subtasks;
  }

  return buildLocalSubtasks(taskTitle);
}

module.exports = {
  generateSubtasks,
};
