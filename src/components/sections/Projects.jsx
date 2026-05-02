import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import { getProjects } from '../../firebase/firestore';
import { DEFAULT_PROJECTS } from '../../utils/constants';
import SectionTitle from '../ui/SectionTitle';

const CATEGORIES = ['All', 'Web', 'Mobile', 'Other'];

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
    <section id="projects" className="section-padding bg-dark-900">
      <div className="container-max">
        <SectionTitle title="My Projects" subtitle="What I've Built" />

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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card overflow-hidden group hover:border-blue-500/30 transition-all duration-300 flex flex-col"
              >
                {/* Image / Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-dark-800 to-dark-900 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-orbitron text-5xl text-transparent bg-clip-text bg-gradient-to-br from-blue-400/40 to-cyan-400/40">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs">
                      <FaStar size={10} /> Featured
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-blue-600/80 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                        aria-label="Live demo"
                      >
                        <FaExternalLinkAlt size={14} />
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        aria-label="GitHub repository"
                      >
                        <FaGithub size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-white font-bold text-lg">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1">{project.description}</p>

                  {/* Tags */}
                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 pt-2">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FaExternalLinkAlt size={12} /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        <FaGithub size={14} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
