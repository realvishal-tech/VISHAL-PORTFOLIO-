import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaUser, FaCode, FaProjectDiagram,
  FaConciergeBell, FaEnvelope, FaShare, FaCog,
  FaSignOutAlt, FaBars, FaTimes, FaTrash, FaCheck,
  FaPlus, FaSave,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAbout, updateAbout,
  getSkills, addSkill, updateSkill, deleteSkill,
  getProjects, addProject, updateProject, deleteProject,
  getMessages, deleteMessage, markMessageRead,
  getSocialLinks, updateSocialLinks,
  getSiteSettings, updateSiteSettings,
} from '../../firebase/firestore';
import { DEFAULT_ABOUT, DEFAULT_SOCIAL_LINKS } from '../../utils/constants';

const NAV = [
  { id: 'overview', label: 'Overview', icon: FaHome },
  { id: 'about', label: 'About', icon: FaUser },
  { id: 'skills', label: 'Skills', icon: FaCode },
  { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
  { id: 'messages', label: 'Messages', icon: FaEnvelope },
  { id: 'social', label: 'Social Links', icon: FaShare },
  { id: 'settings', label: 'Settings', icon: FaCog },
];

/* ─── Reusable input ─────────────────────────────────────── */
function Field({ label, value, onChange, type = 'text', placeholder, rows }) {
  const base =
    'w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors text-sm';
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</label>}
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

/* ─── Overview ───────────────────────────────────────────── */
function Overview({ counts }) {
  const items = [
    { label: 'Projects', value: counts.projects, color: 'from-blue-600 to-blue-500' },
    { label: 'Skills', value: counts.skills, color: 'from-cyan-600 to-cyan-500' },
    { label: 'Messages', value: counts.messages, color: 'from-purple-600 to-purple-500' },
    { label: 'Unread', value: counts.unread, color: 'from-orange-600 to-orange-500' },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-6 bg-gradient-to-br ${color} flex flex-col gap-1`}>
            <span className="text-3xl font-bold text-white">{value ?? '…'}</span>
            <span className="text-sm text-white/80">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-8">Welcome to your portfolio admin panel. Use the sidebar to manage content.</p>
    </div>
  );
}

/* ─── About Editor ───────────────────────────────────────── */
function AboutEditor() {
  const [data, setData] = useState(DEFAULT_ABOUT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAbout().then((d) => { if (d) setData(d); }).catch(() => {});
  }, []);

  const set = (key) => (val) => setData((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAbout(data);
      toast.success('About section saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">About</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          <FaSave size={13} /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Name" value={data.name ?? ''} onChange={set('name')} />
          <Field label="Title" value={data.title ?? ''} onChange={set('title')} />
        </div>
        <Field label="Bio" value={data.bio ?? ''} onChange={set('bio')} rows={4} />
        <Field label="Bio (continued)" value={data.bio2 ?? ''} onChange={set('bio2')} rows={3} />
        <Field label="Profile Photo URL" value={data.profilePhoto ?? ''} onChange={set('profilePhoto')} placeholder="https://..." />
      </div>
    </div>
  );
}

/* ─── Skills Manager ─────────────────────────────────────── */
function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', percentage: 80, category: 'Frontend', icon: 'FaReact', order: 99 });

  const load = () => getSkills().then(setSkills).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newSkill.name) return toast.error('Skill name is required');
    try {
      await addSkill({ ...newSkill, percentage: Number(newSkill.percentage), order: Number(newSkill.order) });
      toast.success('Skill added!');
      load();
      setNewSkill({ name: '', percentage: 80, category: 'Frontend', icon: 'FaReact', order: 99 });
    } catch {
      toast.error('Failed to add skill.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id);
      toast.success('Skill deleted.');
      load();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>

      {/* Add form */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Add Skill</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Name" value={newSkill.name} onChange={(v) => setNewSkill((p) => ({ ...p, name: v }))} placeholder="React" />
          <Field label="Percentage" type="number" value={String(newSkill.percentage)} onChange={(v) => setNewSkill((p) => ({ ...p, percentage: v }))} />
          <Field label="Category" value={newSkill.category} onChange={(v) => setNewSkill((p) => ({ ...p, category: v }))} placeholder="Frontend" />
          <Field label="Icon (react-icons name)" value={newSkill.icon} onChange={(v) => setNewSkill((p) => ({ ...p, icon: v }))} placeholder="FaReact" />
          <Field label="Order" type="number" value={String(newSkill.order)} onChange={(v) => setNewSkill((p) => ({ ...p, order: v }))} />
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2 mt-4">
          <FaPlus size={12} /> Add Skill
        </button>
      </div>

      {/* List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((s) => (
          <div key={s.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-white font-medium text-sm">{s.name}</p>
              <p className="text-gray-500 text-xs">{s.category} · {s.percentage}%</p>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 transition-colors p-1">
              <FaTrash size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Projects Manager ───────────────────────────────────── */
function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '', liveUrl: '', githubUrl: '', tags: '', category: 'Web', featured: false });

  const load = () => getProjects().then(setProjects).catch(() => {});
  useEffect(() => { load(); }, []);

  const setField = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  const handleAdd = async () => {
    if (!form.title) return toast.error('Title is required');
    try {
      await addProject({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featured: Boolean(form.featured),
      });
      toast.success('Project added!');
      load();
      setForm({ title: '', description: '', image: '', liveUrl: '', githubUrl: '', tags: '', category: 'Web', featured: false });
    } catch {
      toast.error('Failed to add project.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      toast.success('Project deleted.');
      load();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Add Project</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title" value={form.title} onChange={setField('title')} placeholder="My Project" />
          <Field label="Category" value={form.category} onChange={setField('category')} placeholder="Web" />
          <Field label="Live URL" value={form.liveUrl} onChange={setField('liveUrl')} placeholder="https://..." />
          <Field label="GitHub URL" value={form.githubUrl} onChange={setField('githubUrl')} placeholder="https://github.com/..." />
          <Field label="Image URL" value={form.image} onChange={setField('image')} placeholder="https://..." />
          <Field label="Tags (comma-separated)" value={form.tags} onChange={setField('tags')} placeholder="React, Firebase, Tailwind" />
        </div>
        <Field label="Description" value={form.description} onChange={setField('description')} rows={3} placeholder="Short project description..." />
        <div className="flex items-center gap-3 mt-3">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
            className="w-4 h-4 accent-blue-500"
          />
          <label htmlFor="featured" className="text-sm text-gray-400">Featured project</label>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2 mt-4">
          <FaPlus size={12} /> Add Project
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <div key={p.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-white font-medium">{p.title}</p>
              <p className="text-gray-500 text-sm">{p.category}{p.featured ? ' · Featured' : ''}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 transition-colors p-1">
              <FaTrash size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Messages ───────────────────────────────────────────── */
function MessagesPanel() {
  const [messages, setMessages] = useState([]);

  const load = () => getMessages().then(setMessages).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    await markMessageRead(id).catch(() => {});
    load();
  };
  const handleDelete = async (id) => {
    await deleteMessage(id).then(() => { toast.success('Deleted.'); load(); }).catch(() => toast.error('Failed.'));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Messages ({messages.length})</h2>
      {messages.length === 0 && (
        <p className="text-gray-500">No messages yet.</p>
      )}
      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <div key={m.id} className={`glass-card rounded-xl p-5 ${!m.read ? 'border-blue-500/30' : ''}`}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="font-semibold text-white">{m.name}</span>
                <span className="text-gray-500 text-sm ml-2">{m.email}</span>
                {!m.read && <span className="ml-2 text-xs bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded-full">New</span>}
              </div>
              <div className="flex gap-2 shrink-0">
                {!m.read && (
                  <button onClick={() => handleRead(m.id)} className="text-green-400 hover:text-green-300 p-1" title="Mark as read">
                    <FaCheck size={13} />
                  </button>
                )}
                <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300 p-1">
                  <FaTrash size={13} />
                </button>
              </div>
            </div>
            {m.subject && <p className="text-blue-400 text-sm mb-1">{m.subject}</p>}
            <p className="text-gray-400 text-sm">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Social Links ───────────────────────────────────────── */
function SocialEditor() {
  const [links, setLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSocialLinks().then((d) => { if (d) setLinks(d); }).catch(() => {});
  }, []);

  const set = (key) => (val) => setLinks((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSocialLinks(links);
      toast.success('Social links saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Social Links</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          <FaSave size={13} /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
        {Object.keys(DEFAULT_SOCIAL_LINKS).map((key) => (
          <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={links[key] ?? ''} onChange={set(key)} placeholder={`https://...`} />
        ))}
      </div>
    </div>
  );
}

/* ─── Settings ───────────────────────────────────────────── */
function SettingsPanel() {
  const [settings, setSettings] = useState({ siteTitle: 'Vishal Portfolio', seoDescription: '', maintenanceMode: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings().then((d) => { if (d) setSettings(d); }).catch(() => {});
  }, []);

  const set = (key) => (val) => setSettings((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          <FaSave size={13} /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <Field label="Site Title" value={settings.siteTitle ?? ''} onChange={set('siteTitle')} placeholder="My Portfolio" />
        <Field label="SEO Description" value={settings.seoDescription ?? ''} onChange={set('seoDescription')} rows={3} />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="maintenance"
            checked={settings.maintenanceMode ?? false}
            onChange={(e) => set('maintenanceMode')(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <label htmlFor="maintenance" className="text-sm text-gray-400">Maintenance Mode</label>
        </div>
      </div>
    </div>
  );
}

/* ─── AdminDashboard ─────────────────────────────────────── */
export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ projects: 0, skills: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.all([getProjects(), getSkills(), getMessages()]).then(([p, s, m]) => {
      setCounts({ projects: p.length, skills: s.length, messages: m.length, unread: m.filter((x) => !x.read).length });
    }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out.');
  };

  const PANELS = { overview: <Overview counts={counts} />, about: <AboutEditor />, skills: <SkillsManager />, projects: <ProjectsManager />, messages: <MessagesPanel />, social: <SocialEditor />, settings: <SettingsPanel /> };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-dark-900 border-r border-white/10
        flex flex-col transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10">
          <span className="font-orbitron font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            VISHAL
          </span>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActive(id); setSidebarOpen(false); }}
              className={`sidebar-link w-full mb-1 ${active === id ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span className="text-sm">{label}</span>
              {id === 'messages' && counts.unread > 0 && (
                <span className="ml-auto text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">{counts.unread}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300">
            <FaSignOutAlt size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">
              View Site ↗
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {PANELS[active]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
