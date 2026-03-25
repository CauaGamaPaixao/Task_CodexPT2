async function sendTaskEvent(eventPayload) {
  console.log('Webhook event sent');

  try {
    const webhookUrl = process.env.WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return {
        delivered: false,
        reason: 'WEBHOOK_URL não configurado; envio simulado',
        payload: eventPayload,
      };
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Falha ao enviar webhook (${response.status}): ${body}`);
    }

    return { delivered: true, payload: eventPayload };
  } catch (error) {
    console.error('Webhook service error:', error.message);
    throw error;
  }
}

module.exports = {
  sendTaskEvent,
};
