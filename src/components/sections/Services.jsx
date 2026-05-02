import { motion } from 'framer-motion';
import { FaLaptopCode, FaPalette, FaArrowRight } from 'react-icons/fa';
import { SiFirebase } from 'react-icons/si';
import { DEFAULT_SERVICES } from '../../utils/constants';
import SectionTitle from '../ui/SectionTitle';

const ICON_MAP = { FaLaptopCode, FaPalette, SiFirebase };

export default function Services() {
  return (
    <section id="services" className="section-padding bg-dark-950">
      <div className="container-max">
        <SectionTitle title="My Services" subtitle="What I Offer" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEFAULT_SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || FaLaptopCode;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="glass-card p-8 flex flex-col gap-5 group cursor-default"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5`}
                >
                  <div className="w-full h-full rounded-2xl bg-dark-900 flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                    <Icon className="text-white" size={28} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{service.description}</p>
                </div>

                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <FaArrowRight size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
