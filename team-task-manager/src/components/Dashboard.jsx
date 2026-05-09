import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, done: 0, progress: 0, overdue: 0 });
  const [projects, setProjects] = useState([]);

  // Modal State Additions
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  // ✅ get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ clear user too
    navigate("/");
  };

  const fetchProjects = () => {
    API.get('/projects')
      .then(r => setProjects(r.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    API.get('/tasks/stats')
      .then(r => setStats(r.data))
      .catch(err => console.error(err));

    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!projectForm.name) return setError('Project name is required');
    try {
      await API.post('/projects', projectForm);
      setProjectForm({ name: '', description: '' });
      setError('');
      setShowProjectModal(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating project');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center">

      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-black text-2xl font-bold">Team Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">{user?.name} | {user?.role}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border-2 bg-black border-white text-white rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 cursor-pointer transition"
          >Logout</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-col items-center px-6 py-4 gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {[
            { label: 'Total Tasks',  value: stats.total,    color: 'border-cyan-400' },
            { label: 'Done',         value: stats.done,     color: 'border-green-400' },
            { label: 'In Progress',  value: stats.progress, color: 'border-yellow-400' },
            { label: 'Overdue',      value: stats.overdue,  color: 'border-red-400' },
          ].map(s => (
            <div key={s.label} className={`bg-black rounded-xl p-4 text-center`}>
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-cyan-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="bg-black rounded-xl w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-cyan-400 text-xl font-bold">My Projects</h2>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-4 py-2 bg-cyan-400 text-black font-semibold rounded-full hover:bg-cyan-300 cursor-pointer transition"
              >+ New Project</button>
            )}
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  className="border border-cyan-400 rounded-xl p-4 cursor-pointer hover:bg-cyan-400 hover:text-black transition group"
                >
                  <div className="text-white font-semibold group-hover:text-black">{p.name}</div>
                  <div className="text-gray-400 text-sm mt-1 group-hover:text-black">{p.description}</div>
                  <div className="text-cyan-400 text-xs mt-2 group-hover:text-black">{p.members?.length} members</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-black border-2 border-cyan-400 rounded-xl w-full max-w-md p-6">
            <h2 className="text-cyan-400 text-xl font-bold mb-4">Create New Project</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="flex flex-col gap-3">
              <input
                type="text" placeholder="Project Name" value={projectForm.name}
                onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                className="px-4 py-3 rounded-lg border-2 border-gray-600 bg-white text-black focus:outline-none focus:border-cyan-400"
              />
              <textarea
                placeholder="Description" value={projectForm.description}
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                rows={3}
                className="px-4 py-3 rounded-lg border-2 border-gray-600 bg-white text-black focus:outline-none focus:border-cyan-400 resize-none"
              />
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    setProjectForm({ name: '', description: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-600 text-white font-bold rounded-lg hover:border-white cursor-pointer transition"
                >Cancel</button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 px-4 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 cursor-pointer transition"
                >Create Project</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}