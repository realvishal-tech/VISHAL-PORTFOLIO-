import { motion } from 'framer-motion';
import {
  FaLaptopCode, FaPalette, FaNodeJs,
} from 'react-icons/fa';
import { SiFirebase } from 'react-icons/si';
import SectionTitle from '../ui/SectionTitle';
import { DEFAULT_SERVICES } from '../../utils/constants';

const ICON_MAP = { FaLaptopCode, FaPalette, SiFirebase, FaNodeJs };

function ServiceCard({ icon, title, description, gradient, index }) {
  const Icon = ICON_MAP[icon] ?? FaLaptopCode;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="glass-card rounded-2xl p-8 flex flex-col gap-4 group"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section-padding bg-dark-950">
      <div className="container-max">
        <SectionTitle title="My Services" subtitle="What I Offer" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_SERVICES.map((service, i) => (
            <ServiceCard key={service.title} {...service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
