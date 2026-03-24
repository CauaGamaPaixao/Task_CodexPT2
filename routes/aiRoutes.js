const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post('/generate-subtasks', aiController.generateSubtasks);

module.exports = router;
