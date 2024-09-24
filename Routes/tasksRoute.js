const express = require('express');
const { createTask, getTasks, updateTasks, getSingleTask, searchTasks } = require('../Controller/taskController');
const { protect } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createTask);            // Create a new task
router.get('/search', protect, searchTasks);      // Search for tasks (more specific)
router.get('/:id', protect, getSingleTask);       // Get a single task by ID (less specific)
router.put('/:id', protect, updateTasks);         // Update a task by ID
router.get('/', protect, getTasks);               // Get all tasks (least specific)


module.exports = router;
