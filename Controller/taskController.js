const Task = require('../Models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
