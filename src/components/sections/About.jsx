import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaHeart, FaRocket, FaDownload } from 'react-icons/fa';
import { getAbout } from '../../firebase/firestore';
import { DEFAULT_ABOUT } from '../../utils/constants';
import SectionTitle from '../ui/SectionTitle';

const ICON_MAP = { FaLightbulb, FaHeart, FaRocket };

export default function About() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    getAbout()
      .then((data) => { if (data) setAbout({ ...DEFAULT_ABOUT, ...data }); })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="section-padding bg-dark-900">
      <div className="container-max">
        <SectionTitle title="About Me" subtitle="Who I Am" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 blur-2xl" />
              <div className="relative w-full h-full rounded-3xl glass-card overflow-hidden flex items-center justify-center">
                {about.profilePhoto ? (
                  <img
                    src={about.profilePhoto}
                    alt={about.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-orbitron font-black text-[8rem] text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-400">
                    V
                  </span>
                )}
              </div>

              {/* Stats floating */}
              {about.stats?.map((stat, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                  transition={{ duration: 3 + i, repeat: Infinity }}
                  style={{
                    top: i === 0 ? '-1rem' : i === 1 ? '50%' : undefined,
                    bottom: i === 2 ? '-1rem' : undefined,
                    left: i === 1 ? '-2rem' : undefined,
                    right: i === 0 ? '-2rem' : i === 2 ? '-2rem' : undefined,
                  }}
                  className="absolute glass rounded-2xl px-4 py-3 text-center"
                >
                  <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{about.name}</h3>
              <p className="text-blue-400 font-medium">{about.title}</p>
            </div>

            <p className="text-gray-400 leading-relaxed">{about.bio}</p>
            {about.bio2 && <p className="text-gray-400 leading-relaxed">{about.bio2}</p>}

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {about.highlights?.map((h, i) => {
                const Icon = ICON_MAP[h.icon] || FaRocket;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="glass-card p-4 flex flex-col gap-2"
                  >
                    <Icon className="text-blue-400" size={20} />
                    <p className="text-white font-semibold text-sm">{h.label}</p>
                    <p className="text-gray-500 text-xs">{h.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            <a
              href="/resume.pdf"
              download
              className="btn-primary w-fit inline-flex items-center gap-2"
            >
              <FaDownload size={14} /> Download Resume
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
