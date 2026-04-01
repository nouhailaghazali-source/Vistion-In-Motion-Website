import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Calendar, User, DollarSign, Trash2, Info, X, Clock, MapPin, Film as FilmIcon, Search, Star } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import FeedbackModal from '../components/FeedbackModal';

const Films = () => {
    const { t } = useTranslation();
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackTarget, setFeedbackTarget] = useState({ id: null, title: '', type: '' });

    const openFeedback = (film) => {
        setFeedbackTarget({ id: film.id, title: film.titre, type: 'Film' });
        setIsFeedbackOpen(true);
    };

    useEffect(() => {
        axios.get('/api/films')
            .then(response => {
                setFilms(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching films:", error);
                setLoading(false);
            });
    }, []);

    const filteredFilms = films.filter(film => 
        film.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.realisateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getBadgeClass = (status) => {
        switch (status) {
            case 'en_production': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'distribue': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'en_developpement': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'post_production': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            default: return 'text-muted-foreground bg-muted/10 border-white/10';
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8"
            >
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-1 bg-primary rounded-full" />
                        <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">Vision in Motion</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">{t('films.title')}</h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] mt-4 opacity-70">{t('films.subtitle')}</p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto bg-muted/20 p-2 rounded-2xl backdrop-blur-md border border-border">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder={t('films.search')}
                            className="bg-transparent pl-12 pr-6 py-3 text-sm focus:outline-none w-full text-foreground placeholder:text-muted-foreground/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredFilms.map((film, i) => (
                        <motion.div
                            key={film.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative cursor-pointer"
                            onClick={() => setSelectedFilm(film)}
                        >
                            {/* Card Glow */}
                            <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                            
                            <div className="relative bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:border-primary/50 group-hover:-translate-y-2">
                                {/* Image Section */}
                                <div className="h-64 relative overflow-hidden">
                                    <img 
                                        src={film.affiche_url} 
                                        alt={film.titre}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border-2 backdrop-blur-md ${getBadgeClass(film.statut)}`}>
                                            {t(`films.status.${film.statut}`)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-10 pt-4">
                                    <h3 className="text-3xl font-black text-foreground mb-4 group-hover:text-primary transition-colors uppercase tracking-tighter leading-none">
                                        {film.titre}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-8 opacity-70 italic">
                                        "{film.synopsis || t('common.loading')}"
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest block opacity-50">{t('films.director')}</span>
                                                <span className="text-xs font-bold text-foreground truncate max-w-[100px] block">{film.realisateur || t('common.loading')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            </div>
                                            <div>
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest block opacity-50">Rating</span>
                                                <span className="text-xs font-bold text-foreground">{film.rating_avg > 0 ? `${film.rating_avg}/5` : "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm font-black text-foreground tracking-tighter">
                                                {film.budget ? `${film.budget.toLocaleString()} €` : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">
                                            <Clock className="w-3 h-3" />
                                            {film.duree || "120"} {t('common.min')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Film Detail Modal */}
            <AnimatePresence>
                {selectedFilm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
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
                                            <button 
                                                className="w-full py-4 rounded-xl bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-primary-foreground transition-all shadow-xl"
                                                onClick={() => openFeedback(selectedFilm)}
                                            >
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

            <FeedbackModal 
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                targetId={feedbackTarget.id}
                targetTitle={feedbackTarget.title}
                targetType={feedbackTarget.type}
            />
        </div>
    );
};

export default Films;
