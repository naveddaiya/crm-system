const Task = require('../Models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, dueDate,status} = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks for a user
exports.getTasks = async(req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).populate("user");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// update task for a user
exports.updateTasks = async(req, res) => {
  const taskId = req.params.id
  const updates = req.body
  try {
    let task = await Task.find({_id:taskId, user: req.user._id });

    if(!task){
      res.status(404).json({message:"Task not found or not authorized to update"})
    }
    task = await Task.findByIdAndUpdate(taskId,updates,{new:true,runValidators:true})
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
