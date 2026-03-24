const aiService = require('../services/aiService');

async function generateSubtasks(req, res) {
  try {
    const { taskTitle } = req.body;
    if (!taskTitle || typeof taskTitle !== 'string') {
      return res.status(400).json({ error: 'taskTitle é obrigatório' });
    }

    const subtasks = await aiService.generateSubtasks(taskTitle);
    return res.json(subtasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  generateSubtasks,
};
