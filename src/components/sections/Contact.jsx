import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SectionTitle from '../ui/SectionTitle';
import { addMessage } from '../../firebase/firestore';
import { DEFAULT_SOCIAL_LINKS } from '../../utils/constants';

const SOCIAL = [
  { icon: FaGithub, url: DEFAULT_SOCIAL_LINKS.github, label: 'GitHub' },
  { icon: FaLinkedin, url: DEFAULT_SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { icon: FaTwitter, url: DEFAULT_SOCIAL_LINKS.twitter, label: 'Twitter' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await addMessage(form);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-dark-900/50">
      <div className="container-max">
        <SectionTitle title="Contact Me" subtitle="Get In Touch" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Let's Talk</h3>
              <p className="text-gray-400 leading-relaxed">
                Have a project in mind or just want to say hello? Feel free to reach out. I'm always open to discussing new opportunities, collaborations, or just having a friendly chat!
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${DEFAULT_SOCIAL_LINKS.email}`}
                className="flex items-center gap-4 glass-card rounded-xl p-4 hover:border-blue-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-blue-400" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-white font-medium">{DEFAULT_SOCIAL_LINKS.email}</p>
                </div>
              </a>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-4">Or find me on:</p>
              <div className="flex gap-3">
                {SOCIAL.map(({ icon: Icon, url, label }) => (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-8 flex flex-col gap-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className="bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message..."
                className="bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors text-sm resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaPaperPlane size={14} />
              )}
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
