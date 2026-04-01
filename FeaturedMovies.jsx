import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, ArrowRight, User, Calendar, X, MapPin, Film as FilmIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const FeaturedMovies = () => {
  const { t } = useTranslation();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect(() => {
    axios.get('/api/films')
      .then(response => {
        setFilms(response.data.slice(0, 3));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching featured films:", error);
        setLoading(false);
      });
  }, []);

  const getBadgeClass = (status) => {
    switch (status) {
        case 'en_production': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'distribue': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        case 'en_developpement': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        case 'post_production': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  if (loading) return null;

  return (
    <section className="py-32 container mx-auto px-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">Vision in Motion</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic leading-none text-foreground">{t('featured.title')}</h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed opacity-70">
            {t('featured.description')}
          </p>
        </div>
        <Link to="/films" className="group px-10 py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3 shadow-2xl">
          {t('featured.cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {films.map((film, i) => (
          <motion.div
            key={film.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
            
            <div className="relative bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:border-primary/50 group-hover:-translate-y-2">
              {/* Image Section */}
              <div className="h-80 relative overflow-hidden">
                <img 
                  src={film.affiche_url}
                  alt={film.titre}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                    <Star className="w-3 h-3 fill-current" />
                    NEW
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-10 pt-4">
                <h3 className="text-3xl font-black text-foreground mb-4 group-hover:text-primary transition-colors uppercase tracking-tighter leading-none">
                  {film.titre}
                </h3>
                
                <div className="flex items-center gap-6 mb-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{film.realisateur?.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{film.annee}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-10 opacity-70 italic">
                  "{film.synopsis || t('common.loading')}"
                </p>

                <button 
                  onClick={() => setSelectedFilm(film)}
                  className="w-full py-4 rounded-2xl bg-muted/20 border border-border text-foreground text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-3 group/btn"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> 
                  {t('common.details')}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Film Detail Modal */}
      <AnimatePresence>
        {selectedFilm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFilm(null)}
              className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="bg-card border border-border rounded-[2.5rem] w-full max-w-4xl overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.4)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Side: Image */}
                <div className="w-full md:w-[35%] relative bg-muted/20">
                  <div className="h-[400px] md:h-full relative overflow-hidden">
                    <img 
                      src={selectedFilm.affiche_url} 
                      alt={selectedFilm.titre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:bg-gradient-to-r md:from-transparent/20 md:to-card" />
                  </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-[65%] p-8 md:p-14 relative flex flex-col justify-center">
                  <button 
                    onClick={() => setSelectedFilm(null)}
                    className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-all p-2 rounded-full hover:bg-muted/20 z-20 group"
                  >
                    <X className="w-6 h-6 transition-transform" />
                  </button>

                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-lg border ${getBadgeClass(selectedFilm.statut)}`}>
                          {t(`films.status.${selectedFilm.statut}`)}
                        </span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4 leading-none">
                        {selectedFilm.titre}
                      </h2>
                      <div className="flex flex-wrap gap-5 text-muted-foreground uppercase text-[9px] font-black tracking-[0.2em] opacity-60">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {t('films.location')}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {selectedFilm.duree} {t('common.min')}</span>
                        <span className="flex items-center gap-1.5"><FilmIcon className="w-3.5 h-3.5 text-primary" /> {selectedFilm.genre}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-80">{t('films.synopsis')}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed italic font-serif opacity-90 border-l-2 border-primary/20 pl-6">
                        "{selectedFilm.synopsis || "Une exploration profonde de l'âme marocaine à travers une narration cinématographique innovante."}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">{t('films.director')}</span>
                        <span className="text-base font-bold text-foreground">{selectedFilm.realisateur}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">{t('films.year')}</span>
                        <span className="text-base font-bold text-foreground">{selectedFilm.annee}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">{t('films.budget')}</span>
                        <span className="text-base font-bold text-emerald-500">{selectedFilm.budget ? `${selectedFilm.budget.toLocaleString()} €` : "N/A"}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="w-full py-4 rounded-xl bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-primary-foreground transition-all shadow-xl">
                        {t('common.evaluate')}
                      </button>
                    </div>
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

export default FeaturedMovies;
