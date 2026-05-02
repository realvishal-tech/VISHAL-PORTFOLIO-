import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import SectionTitle from '../ui/SectionTitle';
import { getProjects } from '../../firebase/firestore';
import { DEFAULT_PROJECTS } from '../../utils/constants';

const CATEGORIES = ['All', 'Web', 'Mobile', 'Design'];

function ProjectCard({ title, description, image, liveUrl, githubUrl, tags, featured }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-900/40 to-dark-900 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="font-orbitron text-4xl font-bold text-blue-500/30">
            {title?.[0]}
          </span>
        )}
        {featured && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-blue-600/80 text-white">
            Featured
          </span>
        )}
        {/* Overlay links */}
        <div className="absolute inset-0 bg-dark-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {liveUrl && liveUrl !== '#' && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:text-blue-400 transition-colors"
              aria-label="Live demo"
            >
              <FaExternalLinkAlt size={16} />
            </a>
          )}
          {githubUrl && githubUrl !== '#' && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:text-blue-400 transition-colors"
              aria-label="GitHub repo"
            >
              <FaGithub size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1">{description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {(tags ?? []).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getProjects()
      .then((data) => { if (data?.length) setProjects(data); })
      .catch(() => {});
  }, []);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding bg-dark-900/50">
      <div className="container-max">
        <SectionTitle title="My Projects" subtitle="What I've Built" />

        {/* Filter */}
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

        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id ?? project.title} {...project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-16">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
