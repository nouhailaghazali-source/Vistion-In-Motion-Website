import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, X, Sparkles, Trophy, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const [showStory, setShowStory] = useState(false);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16 pt-16">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070" 
          alt="Cinema Hall" 
          className="w-full h-full object-cover opacity-60 dark:opacity-40"
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-background/40 dark:bg-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6 text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t('hero.badge')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase text-foreground drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
          >
            {t('hero.title_part1')} <br/>
            <span className="text-primary">
              {t('hero.title_part2')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-foreground/90 dark:text-muted-foreground mb-12 max-w-2xl leading-relaxed font-semibold drop-shadow-md"
          >
            {t('hero.description')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              to="/films" 
              className="group relative inline-flex items-center justify-center px-10 py-5 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('hero.cta_films')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <button 
              onClick={() => setShowStory(true)}
              className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-muted/20 border-2 border-primary/20 dark:border-border backdrop-blur-md font-bold uppercase tracking-widest text-sm hover:bg-muted/40 transition-all hover:scale-105 active:scale-95 text-foreground"
            >
              <BookOpen className="mr-2 w-5 h-5 text-primary" /> {t('hero.cta_history')}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {showStory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStory(false)}
              className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-card border border-border rounded-[3rem] w-full max-w-3xl overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.4)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.9)] max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="p-10 md:p-16">
                <button 
                  onClick={() => setShowStory(false)}
                  className="absolute top-8 right-8 text-muted-foreground hover:text-primary transition-all p-2 rounded-full hover:bg-muted/10 z-20 group"
                >
                  <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                </button>

                <div className="space-y-12">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">{t('history.genesis')}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-8 leading-none">
                      {t('history.title_part1')} <span className="text-primary italic">{t('history.title_part2')}</span>
                    </h2>
                  </div>

                  <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed font-sans border-l-4 border-primary/20 pl-8">
                    <p>
                      {t('history.p1')}
                    </p>
                    <p>
                      {t('history.p2')}
                    </p>
                  </div>

                  <div className="pt-6 text-center">
                    <button 
                      onClick={() => setShowStory(false)}
                      className="px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                      {t('history.cta')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;

