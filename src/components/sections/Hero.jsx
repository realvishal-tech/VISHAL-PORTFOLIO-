import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaArrowDown } from 'react-icons/fa';
import { TYPING_STRINGS, DEFAULT_SOCIAL_LINKS } from '../../utils/constants';

function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const count = 30;
    const particles = [];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#60a5fa'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.className = 'particle';
      p.style.cssText = `
        width:${size}px;height:${size}px;
        background:${color};
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 15 + 10}s;
        animation-delay:${Math.random() * 10}s;
        box-shadow:0 0 ${size * 2}px ${color};
      `;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach(p => p.remove());
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
}

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950"
    >
      {/* Gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <Particles />

      <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Text Content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-400">Available for work</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-gray-400 text-lg mb-2">Hi, I'm</p>
              <h1 className="font-orbitron font-black text-6xl md:text-7xl lg:text-8xl neon-text text-white">
                VISHAL
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl font-medium text-gray-300 h-8"
            >
              <span className="text-blue-400">{'< '}</span>
              <ReactTyped
                strings={TYPING_STRINGS}
                typeSpeed={60}
                backSpeed={40}
                loop
                className="text-white"
              />
              <span className="text-blue-400">{' />'}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gray-400 text-lg leading-relaxed max-w-xl"
            >
              Passionate BCA student crafting beautiful, functional web experiences. 
              Turning ideas into pixel-perfect reality with modern technologies.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={scrollToProjects} className="btn-primary text-base">
                View Projects
              </button>
              <button onClick={scrollToContact} className="btn-outline text-base">
                Contact Me
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-4 pt-2"
            >
              <span className="text-gray-500 text-sm">Follow me:</span>
              {[
                { icon: FaGithub, url: DEFAULT_SOCIAL_LINKS.github, label: 'GitHub' },
                { icon: FaLinkedin, url: DEFAULT_SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
                { icon: FaTwitter, url: DEFAULT_SOCIAL_LINKS.twitter, label: 'Twitter' },
                { icon: FaEnvelope, url: `mailto:${DEFAULT_SOCIAL_LINKS.email}`, label: 'Email' },
              ].map(({ icon: Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center order-1 lg:order-2"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 blur-xl opacity-40 scale-110" />
              {/* Rotating gradient border */}
              <div className="relative">
                <div className="profile-ring">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-dark-900 flex items-center justify-center">
                      <span className="font-orbitron font-black text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-400">
                        V
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 text-sm font-medium text-blue-400 border border-blue-500/30"
              >
                React ⚛️
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 text-sm font-medium text-cyan-400 border border-cyan-500/30"
              >
                🔥 Firebase
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 cursor-pointer"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs uppercase tracking-widest">Scroll Down</span>
          <FaArrowDown size={14} />
        </motion.div>
      </div>
    </section>
  );
}
