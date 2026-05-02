import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt, FaBriefcase, FaTools, FaUser,
  FaEnvelope, FaCog, FaTrash, FaPlus, FaCheck,
  FaBars, FaTimes, FaEye,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  getProjects, addProject, updateProject, deleteProject,
  getSkills, addSkill, updateSkill, deleteSkill,
  getAbout, updateAbout,
  getMessages, deleteMessage, markMessageRead,
  getSocialLinks, updateSocialLinks,
} from '../../firebase/firestore';
import {
  DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_ABOUT, DEFAULT_SOCIAL_LINKS,
} from '../../utils/constants';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className="w-5 h-5 rounded-full border-2 border-blue-500/30 border-t-blue-400"
    />
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-6 max-w-sm w-full"
      >
        <p className="text-white mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-outline text-sm py-2">Cancel</button>
          <button onClick={onConfirm} className="btn-primary text-sm py-2 bg-red-600 hover:bg-red-500 from-red-600 to-red-500">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Tab: Projects ────────────────────────────────────────────────────────────

function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', liveUrl: '', githubUrl: '', tags: '', category: 'Web', featured: false, image: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    getProjects()
      .then((data) => setProjects(data?.length ? data : DEFAULT_PROJECTS))
      .catch(() => setProjects(DEFAULT_PROJECTS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setForm({ title: '', description: '', liveUrl: '', githubUrl: '', tags: '', category: 'Web', featured: false, image: '' });
    setEditId(null);
  };

  const handleEdit = (project) => {
    setForm({ ...project, tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '') });
    setEditId(project.id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Title is required.'); return; }
    setSaving(true);
    const data = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (editId) {
        await updateProject(editId, data);
        toast.success('Project updated!');
      } else {
        await addProject(data);
        toast.success('Project added!');
      }
      resetForm();
      load();
    } catch {
      toast.error('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      toast.success('Project deleted.');
      setConfirmDelete(null);
      load();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {confirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Form */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">{editId ? 'Edit Project' : 'Add Project'}</h3>
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'title', placeholder: 'Project title', label: 'Title *' },
            { name: 'liveUrl', placeholder: 'https://...', label: 'Live URL' },
            { name: 'githubUrl', placeholder: 'https://github.com/...', label: 'GitHub URL' },
            { name: 'image', placeholder: 'Image URL', label: 'Image URL' },
            { name: 'tags', placeholder: 'React, Tailwind, Firebase', label: 'Tags (comma separated)' },
          ].map(({ name, placeholder, label }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">{label}</label>
              <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm" />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 text-sm">
              {['Web', 'Mobile', 'Other'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Describe the project..."
              className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm resize-none" />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange}
              className="w-4 h-4 accent-blue-500" />
            <label htmlFor="featured" className="text-sm text-gray-400">Mark as featured</label>
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {saving ? <Spinner /> : <FaPlus size={12} />}
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">All Projects ({projects.length})</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-white/5">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{p.title}</p>
                  <p className="text-gray-500 text-xs truncate">{p.description}</p>
                </div>
                {p.featured && <span className="text-xs text-yellow-400 px-2 py-0.5 rounded-full bg-yellow-500/10">Featured</span>}
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(p)} className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors" aria-label="Edit"><FaCheck size={12} /></button>
                  <button onClick={() => setConfirmDelete(p.id)} className="p-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors" aria-label="Delete"><FaTrash size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Skills ──────────────────────────────────────────────────────────────

function SkillsTab() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', percentage: 75, category: 'Frontend', icon: '', order: 0 });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    getSkills()
      .then((data) => setSkills(data?.length ? data : DEFAULT_SKILLS))
      .catch(() => setSkills(DEFAULT_SKILLS))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'percentage' || name === 'order' ? Number(value) : value }));
  };

  const resetForm = () => {
    setForm({ name: '', percentage: 75, category: 'Frontend', icon: '', order: 0 });
    setEditId(null);
  };

  const handleEdit = (skill) => {
    setForm({ name: skill.name, percentage: skill.percentage, category: skill.category, icon: skill.icon || '', order: skill.order || 0 });
    setEditId(skill.id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required.'); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateSkill(editId, form);
        toast.success('Skill updated!');
      } else {
        await addSkill(form);
        toast.success('Skill added!');
      }
      resetForm();
      load();
    } catch {
      toast.error('Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id);
      toast.success('Skill deleted.');
      setConfirmDelete(null);
      load();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {confirmDelete && (
        <ConfirmDialog
          message="Delete this skill?"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Form */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">{editId ? 'Edit Skill' : 'Add Skill'}</h3>
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. React"
              className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Proficiency: {form.percentage}%</label>
            <input type="range" name="percentage" min={0} max={100} value={form.percentage} onChange={handleChange}
              className="accent-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 text-sm">
              {['Frontend', 'Backend', 'Tools'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Icon name (e.g. FaReact)</label>
            <input name="icon" value={form.icon} onChange={handleChange} placeholder="FaReact"
              className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">Sort order</label>
            <input type="number" name="order" value={form.order} onChange={handleChange}
              className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 text-sm" />
          </div>
          <div className="flex items-end gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {saving ? <Spinner /> : <FaPlus size={12} />}
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">All Skills ({skills.length})</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{s.name}</span>
                    <span className="text-blue-400 text-xs">{s.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div style={{ width: `${s.percentage}%` }} className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                  </div>
                  <span className="text-gray-500 text-xs">{s.category}</span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => handleEdit(s)} className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors" aria-label="Edit"><FaCheck size={11} /></button>
                  <button onClick={() => setConfirmDelete(s.id)} className="p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors" aria-label="Delete"><FaTrash size={11} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: About ───────────────────────────────────────────────────────────────

function AboutTab() {
  const [form, setForm] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAbout()
      .then((data) => { if (data) setForm({ ...DEFAULT_ABOUT, ...data }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAbout(form);
      toast.success('About section updated!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-5">
      <h3 className="text-white font-semibold">About Section</h3>

      {[
        { name: 'name', label: 'Display Name', placeholder: 'Vishal' },
        { name: 'title', label: 'Title/Role', placeholder: 'BCA Student & Future Full Stack Developer' },
        { name: 'profilePhoto', label: 'Profile Photo URL', placeholder: 'https://...' },
      ].map(({ name, label, placeholder }) => (
        <div key={name} className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">{label}</label>
          <input name={name} value={form[name] || ''} onChange={handleChange} placeholder={placeholder}
            className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm" />
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">Bio (paragraph 1)</label>
        <textarea name="bio" value={form.bio || ''} onChange={handleChange} rows={4}
          className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm resize-none" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">Bio (paragraph 2)</label>
        <textarea name="bio2" value={form.bio2 || ''} onChange={handleChange} rows={4}
          className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm resize-none" />
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-fit flex items-center gap-2 disabled:opacity-60">
        {saving ? <Spinner /> : <FaCheck size={12} />} Save Changes
      </button>
    </form>
  );
}

// ─── Tab: Messages ────────────────────────────────────────────────────────────

function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = () => {
    setLoading(true);
    getMessages()
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    } catch {
      toast.error('Failed to mark as read.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      toast.success('Message deleted.');
      setConfirmDelete(null);
      load();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col gap-4">
      {confirmDelete && (
        <ConfirmDialog
          message="Delete this message?"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">
          Messages{' '}
          {unread > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs">{unread} unread</span>
          )}
        </h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No messages yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`glass-card p-5 border ${msg.read ? 'border-white/5' : 'border-blue-500/20'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">{msg.name}</p>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                  </div>
                  <p className="text-gray-500 text-xs">{msg.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!msg.read && (
                    <button onClick={() => handleMarkRead(msg.id)}
                      className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors" aria-label="Mark read">
                      <FaEye size={12} />
                    </button>
                  )}
                  <button onClick={() => setConfirmDelete(msg.id)}
                    className="p-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors" aria-label="Delete">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              {msg.subject && <p className="text-gray-400 text-sm font-medium mb-1">{msg.subject}</p>}
              <p className="text-gray-400 text-sm leading-relaxed">{msg.message}</p>
              {msg.createdAt?.toDate && (
                <p className="text-gray-600 text-xs mt-3">{msg.createdAt.toDate().toLocaleString()}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Settings ────────────────────────────────────────────────────────────

function SettingsTab() {
  const [links, setLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSocialLinks()
      .then((data) => { if (data) setLinks({ ...DEFAULT_SOCIAL_LINKS, ...data }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setLinks((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSocialLinks(links);
      toast.success('Social links updated!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <form onSubmit={handleSave} className="glass-card p-6 flex flex-col gap-5">
      <h3 className="text-white font-semibold">Social Links</h3>
      {[
        { name: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username' },
        { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
        { name: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/username' },
        { name: 'email', label: 'Email Address', placeholder: 'you@example.com' },
      ].map(({ name, label, placeholder }) => (
        <div key={name} className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">{label}</label>
          <input name={name} value={links[name] || ''} onChange={handleChange} placeholder={placeholder}
            className="px-3 py-2.5 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 text-sm" />
        </div>
      ))}
      <button type="submit" disabled={saving} className="btn-primary w-fit flex items-center gap-2 disabled:opacity-60">
        {saving ? <Spinner /> : <FaCheck size={12} />} Save Links
      </button>
    </form>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'projects', label: 'Projects', icon: FaBriefcase, component: ProjectsTab },
  { id: 'skills', label: 'Skills', icon: FaTools, component: SkillsTab },
  { id: 'about', label: 'About', icon: FaUser, component: AboutTab },
  { id: 'messages', label: 'Messages', icon: FaEnvelope, component: MessagesTab },
  { id: 'settings', label: 'Settings', icon: FaCog, component: SettingsTab },
];

export default function AdminDashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component || ProjectsTab;

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : undefined }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-white/10 flex flex-col
          transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <h2 className="font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-lg">
            Admin Panel
          </h2>
          <p className="text-gray-500 text-xs mt-1 truncate">{currentUser?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`sidebar-link ${activeTab === id ? 'active' : ''}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-600/10">
            <FaSignOutAlt size={16} /> Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
            <h1 className="text-white font-semibold capitalize">{activeTab}</h1>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5">
            View Site →
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
