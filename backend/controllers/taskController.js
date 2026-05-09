import Task from '../models/Tasks.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

// GET all tasks for a project
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// craete a task
export const createTask = async (req, res) => {
  const { title, description, priority, assignedTo, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only project creator can add tasks
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create tasks' });
    }

    const task = await Task.create({
      title, description, priority, assignedTo: assignedTo || null, dueDate,
      project: req.params.projectId,
      createdBy: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// update task status
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    
    const isCreator = project.createdBy.toString() === req.user.id;
    const isAssigned = task.assignedTo?.toString() === req.user.id;

    if (!isCreator && !isAssigned) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// deleete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};
    if (user.role === 'admin') {
      const projects = await Project.find({ createdBy: req.user.id });
      const projectIds = projects.map(p => p._id);
      query = { project: { $in: projectIds } };
    } else {
      query = { assignedTo: req.user.id };
    }

    const total    = await Task.countDocuments(query);
    const done     = await Task.countDocuments({ ...query, status: 'done' });
    const progress = await Task.countDocuments({ ...query, status: 'inprogress' });
    const overdue  = await Task.countDocuments({
      ...query,
      status: { $ne: 'done' },
      dueDate: { $lt: new Date() }
    });
    res.json({ total, done, progress, overdue });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};