const githubService = require('../services/githubService');
const webhookService = require('../services/webhookService');
const userService = require('../services/userService');
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
    const { event, taskTitle, status, assignee } = req.body;
    if (!event || !taskTitle) {
      return res.status(400).json({ error: 'event e taskTitle são obrigatórios' });
    }

    const payload = {
      source: 'taskmaster',
      event,
      taskTitle,
      status,
      assignee,
      timestamp: new Date().toISOString(),
    };

    const webhookResult = await webhookService.sendTaskEvent(payload);
    const logEntry = await externalDataService.logActivity({
      ...payload,
      webhook: webhookResult,
    });

    return res.json({ ok: true, webhook: webhookResult, log: logEntry });
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

async function listUsers(_req, res) {
  try {
    const users = await userService.getUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPullRequest,
  notifyTaskEvent,
  listActivities,
  listUsers,
};
