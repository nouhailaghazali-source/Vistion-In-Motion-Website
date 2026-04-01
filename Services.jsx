import React from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, FileText, Users, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const services = [
    {
      title: t('services.production.title'),
      description: t('services.production.desc'),
      icon: Clapperboard,
      link: "/films",
      color: "text-blue-400"
    },
    {
      title: t('services.scenarios.title'),
      description: t('services.scenarios.desc'),
      icon: FileText,
      link: "/scenarios",
      color: "text-amber-400"
    },
    {
      title: t('services.talents.title'),
      description: t('services.talents.desc'),
      icon: Users,
      link: "/personnel",
      color: "text-emerald-400"
    },
    {
      title: t('services.distribution.title'),
      description: t('services.distribution.desc'),
      icon: Globe,
      link: "/commerce",
      color: "text-purple-400"
    }
  ];

  return (
    <section className="py-32 container mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase">{t('services.title')}</h2>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -15, transition: { duration: 0.3 } }}
            className="p-10 rounded-3xl bg-muted/20 border border-white/5 hover:border-primary/40 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <service.icon className="w-24 h-24" />
            </div>
            
            <div className={`mb-8 p-4 rounded-2xl bg-muted/30 inline-block ${service.color} group-hover:scale-110 transition-transform duration-500`}>
              <service.icon className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors tracking-tight uppercase">{service.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-medium">
              {service.description}
            </p>
            
            <Link to={service.link} className="inline-flex items-center text-xs font-black text-primary hover:gap-3 transition-all tracking-[0.2em] uppercase">
              {t('services.explore')} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
