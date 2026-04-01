import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Stats = ({ stats, loading }) => {
  const { t } = useTranslation();
  if (loading) return null;
  if (!stats) return null;

  const statItems = [
    { label: t('stats_section.films'), value: stats.totalFilms },
    { label: t('stats_section.scenarios'), value: stats.totalScenarios },
    { label: t('stats_section.talents'), value: stats.totalPersonnel },
    { label: t('stats_section.operations'), value: stats.totalOperationsCommerce }
  ];

  return (
    <section className="py-24 border-y border-border bg-muted/20 dark:bg-[#1a1412] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-[#3d2b1f]/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {statItems.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="text-5xl md:text-6xl font-black text-primary mb-3 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
