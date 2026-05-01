import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import { NAV_LINKS, DEFAULT_SOCIAL_LINKS } from '../../utils/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  const handleNavClick = (href) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-950 border-t border-white/10 py-12 px-4">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-orbitron font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
              VISHAL
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              BCA Student & Future Full Stack Developer. Building the web, one project at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              {[
                { icon: FaGithub, url: DEFAULT_SOCIAL_LINKS.github, label: 'GitHub' },
                { icon: FaLinkedin, url: DEFAULT_SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
                { icon: FaTwitter, url: DEFAULT_SOCIAL_LINKS.twitter, label: 'Twitter' },
              ].map(({ icon: Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4">{DEFAULT_SOCIAL_LINKS.email}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {year} Vishal. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <FaHeart className="text-red-500 mx-1" size={12} /> using React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
