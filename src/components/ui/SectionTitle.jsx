import { motion } from 'framer-motion';

export default function SectionTitle({ title, subtitle, center = true }) {
  return (
    <div className={`mb-16 ${center ? 'text-center' : ''}`}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-blue-400 font-medium text-sm uppercase tracking-widest mb-3"
      >
        {subtitle}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold font-inter text-white dark:text-white"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: center ? '80px' : '80px' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-4 ${center ? 'mx-auto' : ''}`}
      />
    </div>
  );
}
