import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
  FaGitAlt, FaGithub, FaFigma,
} from 'react-icons/fa';
import { SiTailwindcss, SiFirebase, SiVisualstudiocode } from 'react-icons/si';
import { getSkills } from '../../firebase/firestore';
import { DEFAULT_SKILLS } from '../../utils/constants';
import SectionTitle from '../ui/SectionTitle';

const ICON_MAP = {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
  FaGitAlt, FaGithub, FaFigma,
  SiTailwindcss, SiFirebase, SiVisualstudiocode,
};

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Tools'];

export default function Skills() {
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getSkills()
      .then((data) => { if (data?.length) setSkills(data); })
      .catch(() => {});
  }, []);

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="section-padding bg-dark-950">
      <div className="container-max">
        <SectionTitle title="My Skills" subtitle="What I Know" />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((skill, i) => {
            const Icon = ICON_MAP[skill.icon];
            return (
              <motion.div
                key={skill.id || skill.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass-card p-6 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  {Icon && (
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                      <Icon className="text-blue-400" size={22} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{skill.name}</h3>
                    <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-white/5">
                      {skill.category}
                    </span>
                  </div>
                  <span className="text-blue-400 font-bold text-sm">{skill.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.06, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
