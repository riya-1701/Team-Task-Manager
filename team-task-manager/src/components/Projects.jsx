import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Projects() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const fetchProjects = () => API.get('/projects').then(r => setProjects(r.data));
  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async () => {
    if (!form.name) return setError('Project name is required');
    try {
      await API.post('/projects', form);
      setForm({ name: '', description: '' });
      setError('');
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating project');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await API.delete(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center">

      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-black text-2xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>Team Task Manager</h1>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="px-4 py-2 border-2 border-white text-white rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 cursor-pointer transition"
        >Logout</button>
      </div>

      <div className="flex flex-col items-center px-6 py-4 gap-6">

        {/* Create Project Form — Admin only */}
        {user?.role === 'admin' && (
          <div className="bg-black rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-cyan-400 text-xl font-bold mb-4">Create Project</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="flex flex-col gap-3">
              <input
                type="text" placeholder="Project Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-lg border-2 border-gray-600 bg-white text-black focus:outline-none focus:border-cyan-400"
              />
              <textarea
                placeholder="Description" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="px-4 py-3 rounded-lg border-2 border-gray-600 bg-white text-black focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button
                onClick={handleCreate}
                className="px-4 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 cursor-pointer transition"
              >Add Project</button>
            </div>
          </div>
        )}

        {/* Project List */}
        <div className="bg-black rounded-xl w-full max-w-2xl p-6">
          <h2 className="text-cyan-400 text-xl font-bold mb-4">All Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No projects yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map(p => (
                <div key={p._id} className="flex items-center justify-between border border-cyan-400 rounded-xl p-4">
                  <div
                    onClick={() => navigate(`/projects/${p._id}`)}
                    className="cursor-pointer flex-1"
                  >
                    <div className="text-white font-semibold">{p.name}</div>
                    <div className="text-gray-400 text-sm">{p.description}</div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/projects/${p._id}`)}
                      className="px-3 py-1 bg-cyan-400 text-black text-sm font-semibold rounded-lg hover:bg-cyan-300 cursor-pointer"
                    >Open</button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-400 cursor-pointer"
                      >Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}