const githubService = require('../services/githubService');
const slackService = require('../services/slackService');
const externalDataService = require('../services/externalDataService');

async function getPullRequest(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Parâmetro url é obrigatório' });
    }

    const prDetails = await githubService.getPRDetails(url);
    return res.json(prDetails);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function notifyTaskEvent(req, res) {
  try {
    const { event, taskTitle, status } = req.body;
    if (!event || !taskTitle) {
      return res.status(400).json({ error: 'event e taskTitle são obrigatórios' });
    }

    const message = `Task event: ${event} | ${taskTitle}${status ? ` | status: ${status}` : ''}`;
    const slackResult = await slackService.sendNotification(message);
    const logEntry = await externalDataService.logActivity({
      source: 'taskmaster',
      event,
      taskTitle,
      status,
      slack: slackResult,
    });

    return res.json({ ok: true, slack: slackResult, log: logEntry });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function listActivities(_req, res) {
  try {
    const logs = await externalDataService.readLogs();
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPullRequest,
  notifyTaskEvent,
  listActivities,
};
