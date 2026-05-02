import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { addMessage } from '../../firebase/firestore';
import { DEFAULT_SOCIAL_LINKS } from '../../utils/constants';
import SectionTitle from '../ui/SectionTitle';

const SOCIAL = [
  { icon: FaGithub, url: DEFAULT_SOCIAL_LINKS.github, label: 'GitHub' },
  { icon: FaLinkedin, url: DEFAULT_SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { icon: FaTwitter, url: DEFAULT_SOCIAL_LINKS.twitter, label: 'Twitter' },
  { icon: FaEnvelope, url: `mailto:${DEFAULT_SOCIAL_LINKS.email}`, label: 'Email' },
];

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
      setForm(INITIAL_FORM);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-dark-900">
      <div className="container-max">
        <SectionTitle title="Get In Touch" subtitle="Contact Me" />

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Let's Work Together</h3>
              <p className="text-gray-400 leading-relaxed">
                I'm currently open to freelance projects, collaborations, and exciting
                opportunities. Whether you have a project in mind or just want to say hi,
                my inbox is always open!
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${DEFAULT_SOCIAL_LINKS.email}`}
                className="flex items-center gap-4 glass-card p-4 rounded-xl hover:border-blue-500/30 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <FaEnvelope className="text-blue-400" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-white text-sm font-medium">{DEFAULT_SOCIAL_LINKS.email}</p>
                </div>
              </a>
            </div>

            {/* Social links */}
            <div>
              <p className="text-gray-400 text-sm mb-4">Find me on social media:</p>
              <div className="flex gap-4">
                {SOCIAL.map(({ icon: Icon, url, label }) => (
                  <motion.a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm text-gray-400">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="px-4 py-3 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm text-gray-400">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="px-4 py-3 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm text-gray-400">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's it about?"
                  className="px-4 py-3 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm text-gray-400">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or idea..."
                  required
                  className="px-4 py-3 rounded-xl bg-dark-800/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={14} /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
