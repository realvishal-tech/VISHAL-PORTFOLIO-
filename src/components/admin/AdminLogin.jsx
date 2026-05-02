import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      const msg = err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password'
        ? 'Invalid email or password.'
        : 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-blue-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Protected area · Portfolio Admin Panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
