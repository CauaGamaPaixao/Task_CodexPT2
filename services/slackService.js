async function sendNotification(message) {
  const webhook = process.env.SLACK_WEBHOOK_URL;

  if (!webhook) {
    return {
      delivered: false,
      reason: 'SLACK_WEBHOOK_URL não configurado; notificação simulada',
      message,
    };
  }

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao enviar notificação para Slack (${response.status}): ${body}`);
  }

  return { delivered: true, message };
}

module.exports = {
  sendNotification,
};
