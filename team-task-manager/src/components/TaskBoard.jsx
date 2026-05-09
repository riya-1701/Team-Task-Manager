import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const COLUMNS = [
  { key: 'todo',       label: 'To Do' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'done',       label: 'Done' },
];

const PRIORITY_COLORS = {
  high:   'text-red-400 border-red-400',
  medium: 'text-yellow-400 border-yellow-400',
  low:    'text-green-400 border-green-400',
};

export default function TaskBoard() {
  const { projectId } = useParams();
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberToAdd, setMemberToAdd] = useState('');
  
  const [error, setError] = useState('');

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        API.get(`/projects/${projectId}`),
        API.get(`/tasks/${projectId}`),
        API.get(`/users`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        navigate('/dashboard'); // Kick out if not authorized
      }
    }
  };

  useEffect(() => { fetchProjectData(); }, [projectId]);

  const handleCreateOrUpdate = async () => {
    if (!form.title) return setError('Title is required');
    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, form);
      } else {
        await API.post(`/tasks/${projectId}`, form);
      }
      setForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
      setShowForm(false);
      setEditingTask(null);
      setError('');
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving task');
    }
  };

  const openEditForm = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignedTo: task.assignedTo?._id || ''
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchProjectData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchProjectData();
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleAddMember = async () => {
    if (!memberToAdd) return;
    try {
      await API.put(`/projects/${projectId}/members`, { userId: memberToAdd });
      fetchProjectData();
      setMemberToAdd('');
    } catch (err) {
      alert('Error adding member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await API.delete(`/projects/${projectId}/members/${userId}`);
      fetchProjectData();
    } catch (err) {
      alert('Error removing member');
    }
  };

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const isOverdue = (task) => {
    if (task.status === 'done' || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
  };

  const canEditTaskStatus = (task) => {
    return user?.role === 'admin' || task.assignedTo?._id === user?.id;
  };

  const nonMembers = allUsers.filter(u => !project?.members?.some(m => m._id === u._id) && u._id !== project?.createdBy?._id);

  if (!project) return <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center text-xl">Loading Project...</div>;

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center">

      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-black text-2xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>Team Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">{user?.name} | {user?.role}</span>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="px-4 py-2 border-2 border-white text-white rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 cursor-pointer transition"
          >Logout</button>
        </div>
      </div>

      <div className="px-6 pb-6">

        {/* Header and Actions */}
        <div className="flex justify-between items-center mb-6 bg-black/60 p-4 rounded-xl border border-gray-700">
          <div>
            <h2 className="text-cyan-400 text-2xl font-bold">{project.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{project.description}</p>
          </div>
          {user?.role === 'admin' && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowMemberModal(true)}
                className="px-4 py-2 border-2 border-cyan-400 text-cyan-400 font-bold rounded-full hover:bg-cyan-400 hover:text-black transition"
              >Manage Members</button>
              <button
                onClick={() => {
                  setForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
                  setEditingTask(null);
                  setShowForm(!showForm);
                }}
                className="px-4 py-2 bg-cyan-400 text-black font-bold rounded-full hover:bg-cyan-300 cursor-pointer transition"
              >+ Add Task</button>
            </div>
          )}
        </div>

        {/* Manage Members Modal */}
        {showMemberModal && user?.role === 'admin' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-black border-2 border-cyan-400 rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-cyan-400 text-xl font-bold">Project Members</h2>
                <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>
              
              <div className="mb-4 flex gap-2">
                <select 
                  value={memberToAdd} 
                  onChange={e => setMemberToAdd(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select a user to add...</option>
                  {nonMembers.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <button onClick={handleAddMember} className="px-4 py-2 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition">Add</button>
              </div>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <span className="text-white text-sm">{project.createdBy.name} <span className="text-gray-500 text-xs">(Admin / Creator)</span></span>
                </div>
                {project.members.filter(m => m._id !== project.createdBy._id).map(m => (
                  <div key={m._id} className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <span className="text-white text-sm">{m.name}</span>
                    <button onClick={() => handleRemoveMember(m._id)} className="text-red-400 text-xs hover:text-red-300 font-bold uppercase tracking-wider">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Task Modal overlay */}
        {showForm && user?.role === 'admin' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-black border-2 border-cyan-400 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-cyan-400 font-bold text-lg mb-4">{editingTask ? 'Edit Task' : 'New Task'}</h3>
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <div className="flex flex-col gap-3">
                <input
                  type="text" placeholder="Title" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-cyan-400"
                />
                <textarea
                  placeholder="Description" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
                <select
                  value={form.assignedTo}
                  onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Unassigned</option>
                  <option value={project.createdBy._id}>{project.createdBy.name} (Creator)</option>
                  {project.members.filter(m => m._id !== project.createdBy._id).map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                    type="date" value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => { setShowForm(false); setEditingTask(null); }}
                    className="flex-1 py-3 border border-gray-500 text-gray-300 font-bold rounded-lg hover:bg-gray-800 transition"
                  >Cancel</button>
                  <button
                    onClick={handleCreateOrUpdate}
                    className="flex-1 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 cursor-pointer transition"
                  >{editingTask ? 'Save Changes' : 'Create Task'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {COLUMNS.map(col => (
            <div key={col.key} className="bg-black/80 border border-gray-800 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
                <h3 className="text-cyan-400 font-bold text-lg tracking-wide">{col.label}</h3>
                <span className="bg-gray-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-bold">
                  {getTasksByStatus(col.key).length}
                </span>
              </div>

              <div className="flex flex-col gap-3 min-h-[200px]">
                {getTasksByStatus(col.key).length === 0 && (
                  <p className="text-gray-600 text-sm text-center py-8 italic">No tasks here</p>
                )}
                {getTasksByStatus(col.key).map(task => (
                  <div 
                    key={task._id} 
                    className={`bg-gray-900 rounded-xl p-4 border-l-4 border-y border-r border-gray-800 shadow-md transition hover:border-gray-600 ${
                      isOverdue(task) ? 'border-l-red-500 border-red-900/30 bg-red-950/20' : 'border-l-cyan-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-bold text-md pr-2">{task.title}</div>
                      {user?.role === 'admin' && (
                        <div className="flex gap-2">
                          <button onClick={() => openEditForm(task)} className="text-blue-400 text-xs hover:text-blue-300 hover:scale-110 transition">✎</button>
                          <button onClick={() => handleDelete(task._id)} className="text-red-400 text-xs hover:text-red-300 hover:scale-110 transition">✕</button>
                        </div>
                      )}
                    </div>
                    
                    {task.description && (
                      <div className="text-gray-400 text-xs mb-3 line-clamp-2">{task.description}</div>
                    )}
                    
                    <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                      <span className={`text-[10px] uppercase font-bold border px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center gap-2">
                        {task.assignedTo && (
                          <span className="text-[11px] bg-gray-800 border border-gray-700 text-gray-300 px-2 py-1 rounded-md flex items-center gap-1">
                            👤 {task.assignedTo.name.split(' ')[0]}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className={`text-[11px] flex items-center gap-1 ${isOverdue(task) ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                            📅 {new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status buttons */}
                    {canEditTaskStatus(task) && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                        {COLUMNS.filter(c => c.key !== col.key).map(c => (
                          <button
                            key={c.key}
                            onClick={() => handleStatus(task._id, c.key)}
                            className="flex-1 text-xs py-1.5 bg-gray-800 text-gray-300 hover:bg-cyan-400 hover:text-black rounded-lg cursor-pointer transition font-semibold"
                          >→ {c.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}