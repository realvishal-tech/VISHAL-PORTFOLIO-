import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
  FaGitAlt, FaGithub, FaFigma,
} from 'react-icons/fa';
import {
  SiTailwindcss, SiFirebase, SiVisualstudiocode,
} from 'react-icons/si';
import SectionTitle from '../ui/SectionTitle';
import { getSkills } from '../../firebase/firestore';
import { DEFAULT_SKILLS } from '../../utils/constants';

const ICON_MAP = {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
  FaGitAlt, FaGithub, FaFigma,
  SiTailwindcss, SiFirebase, SiVisualstudiocode,
};

function SkillBar({ name, percentage, icon, inView }) {
  const Icon = ICON_MAP[icon] ?? FaReact;
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="text-blue-400" size={18} />
          <span className="text-sm font-medium text-white">{name}</span>
        </div>
        <span className="text-xs text-blue-400 font-semibold">{percentage}%</span>
      </div>
      <div className="h-2 bg-dark-800/80 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${percentage}%` : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  );
}

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Tools'];

export default function Skills() {
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    getSkills()
      .then((data) => { if (data?.length) setSkills(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" ref={sectionRef} className="section-padding bg-dark-950">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <motion.div
              key={skill.id ?? skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <SkillBar {...skill} inView={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
