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

exports.getSingleTask = async(req,res)=>{
  const taskId = req.params.id
  console.log("message " + taskId)
  try {
    const task = await Task.find({_id:taskId,user:req.user._id})
    if(!task || task.length === 0){
      res.status(404).json({message:"Task not found or not authorized to update"})
    }
    else{
      res.status(200).json(task);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// exports.searchTasks = async (req, res) => {
//   const { query } = req.query;
//   try {
//     const tasks = await Task.find({
//       user: req.user._id,
//       $or: [
//         { title: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } }
//       ]
//     });
//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.searchTasks = async (req, res) => {
  try {
    const { query, status, sortBy, order } = req.query;
    
    // Build the search criteria
    let searchCriteria = { user: req.user._id };
    
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (status) {
      searchCriteria.status = status.toUpperCase();
    }

    // Build the sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions = { createdAt: -1 }; // Default sort by creation date, newest first
    }

    const tasks = await Task.find(searchCriteria)
                            .sort(sortOptions)
                            .limit(50); // Limiting results for performance, adjust as needed

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error searching tasks", error: err.message });
  }
};