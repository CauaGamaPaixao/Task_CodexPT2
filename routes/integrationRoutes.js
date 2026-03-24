const express = require('express');
const integrationController = require('../controllers/integrationController');

const router = express.Router();

router.get('/github/pr', integrationController.getPullRequest);
router.post('/events/task', integrationController.notifyTaskEvent);
router.get('/activities', integrationController.listActivities);

module.exports = router;
