const express = require('express');
const { createTask, getTasks, updateTasks } = require('../Controller/taskController');
const { protect } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, updateTasks);

module.exports = router;
