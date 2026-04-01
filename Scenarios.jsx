import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User, Tag, Edit3, Trash2, BookOpen, Clock, Search, Filter, X, Film, CheckCircle, PenTool, Send, Star } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import FeedbackModal from '../components/FeedbackModal';

const Scenarios = () => {
    const { t, i18n } = useTranslation();
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Tous');
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackTarget, setFeedbackTarget] = useState({ id: null, title: '', type: '' });

    const openFeedback = (scenario) => {
        setFeedbackTarget({ id: scenario.id, title: scenario.titre, type: 'Scenario' });
        setIsFeedbackOpen(true);
    };

    useEffect(() => {
        axios.get('/api/scenarios')
            .then(response => {
                setScenarios(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching scenarios:", error);
                setLoading(false);
            });
    }, []);

    const statuses = ['Tous', 'en_ecriture', 'soumis', 'approuve', 'en_production', 'archive'];

    const stats = {
        total: scenarios.length,
        en_ecriture: scenarios.filter(s => s.statut === 'en_ecriture').length,
        approuve: scenarios.filter(s => s.statut === 'approuve').length,
        en_production: scenarios.filter(s => s.statut === 'en_production').length
    };

    const filteredScenarios = scenarios.filter(s => {
        const matchesSearch = s.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (s.genre && s.genre.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = selectedStatus === 'Tous' || s.statut === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getBadgeClass = (status) => {
        switch (status) {
            case 'en_ecriture': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'approuve': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'soumis': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'en_production': return 'text-primary bg-primary/10 border-primary/20';
            case 'archive': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-muted-foreground bg-muted/10 border-white/10';
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

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
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">{t('scenarios.title')}</h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] mt-4 opacity-70">{t('scenarios.subtitle')}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto bg-muted/20 p-2 rounded-2xl backdrop-blur-md border border-border">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder={t('scenarios.search')}
                            className="bg-transparent pl-12 pr-6 py-3 text-sm focus:outline-none w-full sm:w-64 text-foreground placeholder:text-muted-foreground/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="h-10 w-[1px] bg-border hidden sm:block self-center" />
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select 
                            className="bg-transparent pl-12 pr-10 py-3 text-sm focus:outline-none cursor-pointer appearance-none w-full sm:w-48 text-foreground"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status} className="bg-background text-foreground">
                                    {status === 'Tous' ? t('scenarios.filter_all') : t(`films.status.${status}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                {[
                    { label: t('scenarios.stats.total'), value: stats.total, icon: FileText, color: 'text-foreground', bg: 'bg-muted/20' },
                    { label: t('scenarios.stats.writing'), value: stats.en_ecriture, icon: PenTool, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { label: t('scenarios.stats.approved'), value: stats.approuve, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: t('scenarios.stats.production'), value: stats.en_production, icon: Film, color: 'text-primary', bg: 'bg-primary/10' }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${item.bg} border border-border p-8 rounded-[2rem] backdrop-blur-sm hover:border-primary/50 transition-all group`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className={`p-3 rounded-xl ${item.bg} border border-border group-hover:scale-110 transition-transform`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <span className="text-3xl font-black text-foreground">{item.value}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{item.label}</p>
                    </motion.div>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {filteredScenarios.length > 0 ? (
                        filteredScenarios.map((scenario, i) => (
                            <motion.div
                                key={scenario.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative cursor-pointer"
                                onClick={() => setSelectedScenario(scenario)}
                            >
                                {/* Paper stack effect */}
                                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] translate-x-1.5 translate-y-1.5 group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-700 blur-[2px]" />
                                <div className="absolute inset-0 bg-muted/20 rounded-[2.5rem] translate-x-0.5 translate-y-0.5 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-600" />
                                
                                <div className="relative bg-card/90 border border-border rounded-[2.5rem] p-12 backdrop-blur-2xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 rounded-2xl bg-muted/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                                <FileText className="w-7 h-7" />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-xl border ${getBadgeClass(scenario.statut)}`}>
                                                {t(`films.status.${scenario.statut}`)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-4xl font-black text-foreground mb-8 uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-500">
                                        {scenario.titre}
                                    </h3>
                                    
                                    <div className="relative mb-12">
                                        <div className="absolute left-0 top-0 w-1 h-full bg-primary/20 rounded-full" />
                                        <p className="text-muted-foreground text-lg leading-relaxed italic pl-8 opacity-80 line-clamp-3">
                                            "{scenario.description || t('common.loading')}"
                                        </p>
                                    </div>

                                    {/* Metadata Grid */}
                                    <div className="grid grid-cols-2 gap-8 mb-12">
                                        <div className="flex items-center gap-5 group/meta">
                                            <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center text-primary group-hover/meta:bg-muted/30 transition-all">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest block mb-1 opacity-50">{t('scenarios.author')}</span>
                                                <span className="text-base font-bold text-foreground group-hover/meta:text-primary transition-colors">{scenario.auteur || "Anonyme"}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5 group/meta">
                                            <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center text-primary group-hover/meta:bg-muted/30 transition-all">
                                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest block mb-1 opacity-50">Rating</span>
                                                <span className="text-base font-bold text-foreground group-hover/meta:text-primary transition-colors">{scenario.rating_avg > 0 ? `${scenario.rating_avg}/5` : "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center gap-6 pt-10 border-t border-border">
                                        <button 
                                            className="flex-1 py-5 rounded-2xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(var(--primary-rgb),0.1)]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openFeedback(scenario);
                                            }}
                                        >
                                            <Send className="w-5 h-5" /> 
                                            {t('common.feedback')}
                                        </button>
                                        <div className="flex items-center gap-3 px-6 py-5 rounded-2xl bg-muted/20 text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">
                                            <Clock className="w-4 h-4" />
                                            {new Date(scenario.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Search className="w-10 h-10 text-muted-foreground/30" />
                            </div>
                            <p className="text-muted-foreground text-xl italic opacity-50 uppercase tracking-widest">
                                {t('scenarios.search_no_results')}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Scenario Detail Modal */}
            <AnimatePresence>
                {selectedScenario && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedScenario(null)}
                            className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-card border border-border rounded-[2.5rem] w-full max-w-4xl overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.4)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Left Side: Visual Representation */}
                                <div className="w-full md:w-[35%] relative bg-muted/20">
                                    <div className="h-[300px] md:h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/20 to-card">
                                        <FileText className="w-32 h-32 text-primary/40" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:bg-gradient-to-r md:from-transparent/20 md:to-card" />
                                    </div>
                                </div>

                                {/* Right Side: Details */}
                                <div className="w-full md:w-[65%] p-8 md:p-14 relative flex flex-col justify-center">
                                    <button 
                                        onClick={() => setSelectedScenario(null)}
                                        className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-all p-2 rounded-full hover:bg-muted/20 z-20 group"
                                    >
                                        <X className="w-6 h-6 transition-transform" />
                                    </button>

                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-lg border ${getBadgeClass(selectedScenario.statut)}`}>
                                                    {t(`films.status.${selectedScenario.statut}`)}
                                                </span>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4 leading-none">
                                                {selectedScenario.titre}
                                            </h2>
                                            <div className="flex flex-wrap gap-5 text-muted-foreground uppercase text-[9px] font-black tracking-[0.2em] opacity-60">
                                                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary" /> {selectedScenario.auteur}</span>
                                                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-primary" /> {selectedScenario.genre}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {new Date(selectedScenario.created_at).getFullYear()}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-80">{t('scenarios.pitch')}</h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed italic font-serif opacity-90 border-l-2 border-primary/20 pl-6">
                                                "{selectedScenario.description || "Une exploration profonde de l'âme marocaine à travers une narration cinématographique innovante."}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border">
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">{t('scenarios.status_prod')}</span>
                                                <span className="text-base font-bold text-foreground">
                                                    {selectedScenario.film_id ? t('scenarios.prod_ready') : t('scenarios.prod_available')}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">{t('scenarios.type')}</span>
                                                <span className="text-base font-bold text-foreground">{selectedScenario.genre}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                className="w-full py-4 rounded-xl bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-primary-foreground transition-all shadow-xl flex items-center justify-center gap-3"
                                                onClick={() => openFeedback(selectedScenario)}
                                            >
                                                <Send className="w-4 h-4" /> {t('common.feedback')}
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

export default Scenarios;
