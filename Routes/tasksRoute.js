const express = require('express');
const { createTask, getTasks } = require('../Controller/taskController');
const { protect } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);

module.exports = router;
