import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaHeart, FaRocket, FaDownload } from 'react-icons/fa';
import SectionTitle from '../ui/SectionTitle';
import { getAbout } from '../../firebase/firestore';
import { DEFAULT_ABOUT } from '../../utils/constants';

const ICON_MAP = { FaLightbulb, FaHeart, FaRocket };

export default function About() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    getAbout()
      .then((data) => { if (data) setAbout(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="section-padding bg-dark-900/50">
      <div className="container-max">
        <SectionTitle title="About Me" subtitle="Who I Am" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Avatar / visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden glass-card flex items-center justify-center">
                {about.profilePhoto ? (
                  <img
                    src={about.profilePhoto}
                    alt={about.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-orbitron font-black text-8xl text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-400">
                    {about.name?.[0] ?? 'V'}
                  </span>
                )}
              </div>
              {/* Stats */}
              <div className="absolute -bottom-6 -right-6 grid grid-cols-3 gap-2">
                {(about.stats ?? DEFAULT_ABOUT.stats).map(({ value, label }) => (
                  <div key={label} className="glass-card rounded-xl p-3 text-center min-w-[70px]">
                    <div className="text-lg font-bold text-blue-400">{value}</div>
                    <div className="text-xs text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{about.name}</h3>
              <p className="text-blue-400 font-medium">{about.title}</p>
            </div>

            <p className="text-gray-400 leading-relaxed">{about.bio}</p>
            <p className="text-gray-400 leading-relaxed">{about.bio2}</p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-3 gap-4 mt-2">
              {(about.highlights ?? DEFAULT_ABOUT.highlights).map(({ icon, label, desc }) => {
                const Icon = ICON_MAP[icon] ?? FaHeart;
                return (
                  <motion.div
                    key={label}
                    whileHover={{ y: -4 }}
                    className="glass-card rounded-xl p-4 flex flex-col gap-2"
                  >
                    <Icon className="text-blue-400" size={20} />
                    <div className="font-semibold text-white text-sm">{label}</div>
                    <div className="text-xs text-gray-400">{desc}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary"
              >
                Hire Me
              </a>
              <a
                href="#"
                className="btn-outline flex items-center gap-2"
                onClick={(e) => e.preventDefault()}
              >
                <FaDownload size={14} />
                Download CV
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
