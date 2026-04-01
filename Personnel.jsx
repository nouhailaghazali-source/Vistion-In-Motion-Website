import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Personnel = () => {
    const { t } = useTranslation();
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('Tous');
    const [selectedTalent, setSelectedTalent] = useState(null);

    useEffect(() => {
        axios.get('/api/personnel')
            .then(response => {
                setPersonnel(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching personnel:", error);
                setLoading(false);
            });
    }, []);

    const roles = ['Tous', ...new Set(personnel.map(p => p.role))];

    const filteredPersonnel = personnel.filter(p => {
        const matchesSearch = `${p.prenom} ${p.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.specialite && p.specialite.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = selectedRole === 'Tous' || p.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const getBadgeClass = (role) => {
        switch (role.toLowerCase()) {
            case 'réalisatrice':
            case 'réalisateur': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'actrice principale':
            case 'acteur': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'producteur': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter text-primary uppercase">{t('talents.title')}</h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1 opacity-70">{t('talents.subtitle')}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder={t('talents.search')}
                        className="bg-muted/20 border border-border rounded-full px-6 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all w-full sm:w-64 text-foreground placeholder:text-muted-foreground/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        className="bg-muted/20 border border-border rounded-full px-6 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all cursor-pointer text-foreground"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        {roles.map(role => (
                            <option key={role} value={role} className="bg-background text-foreground">
                                {role === 'Tous' ? t('talents.filter_all') : role}
                            </option>
                        ))}
                    </select>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredPersonnel.length > 0 ? (
                        filteredPersonnel.map((person, i) => (
                            <motion.div
                                key={person.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card-cinema p-8 text-center group relative overflow-hidden"
                            >
                                {/* Status Indicator */}
                                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${person.disponible ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-[8px] uppercase font-bold tracking-tighter opacity-50">
                                        {person.disponible ? t('talents.available') : t('talents.busy')}
                                    </span>
                                </div>

                                <div className="mx-auto w-24 h-24 rounded-full bg-muted/30 border-2 border-primary/30 flex items-center justify-center mb-6 shadow-xl group-hover:border-primary transition-all overflow-hidden relative">
                                    {person.photo_url ? (
                                        <img 
                                            src={person.photo_url} 
                                            alt={`${person.prenom} ${person.nom}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-500">{person.nom.charAt(0)}</span>
                                    )}
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-all" />
                                </div>
                                
                                <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors">{person.prenom} {person.nom}</h3>
                                <div className="mb-4">
                                    <span className={`text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full border ${getBadgeClass(person.role)}`}>
                                        {person.role}
                                    </span>
                                </div>
                                
                                <p className="text-muted-foreground text-xs mb-6 leading-relaxed line-clamp-2 italic">
                                    {person.specialite || t('talents.subtitle')}
                                </p>

                                <div className="space-y-1 mb-8">
                                    {person.email && (
                                        <p className="text-[10px] text-muted-foreground/70 hover:text-primary transition-colors cursor-pointer truncate">
                                            {person.email}
                                        </p>
                                    )}
                                    {person.telephone && (
                                        <p className="text-[10px] text-muted-foreground/70">
                                            {person.telephone}
                                        </p>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedTalent(person)}
                                    className="w-full py-2 text-[10px] font-bold border border-border rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all uppercase tracking-widest text-foreground hover:text-primary-foreground"
                                >
                                     {t('common.details')}
                                 </button>
                             </motion.div>
                         ))
                     ) : (
                         <div className="col-span-full py-20 text-center opacity-50 italic">
                             {t('talents.no_results')}
                         </div>
                     )}
                 </div>
             )}

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedTalent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTalent(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="h-64 md:h-auto relative">
                                    {selectedTalent.photo_url ? (
                                        <img 
                                            src={selectedTalent.photo_url} 
                                            alt={selectedTalent.nom}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-5xl font-bold text-primary">
                                            {selectedTalent.nom.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getBadgeClass(selectedTalent.role)}`}>
                                            {selectedTalent.role}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-8 space-y-6">
                                    <button 
                                        onClick={() => setSelectedTalent(null)}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>

                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{selectedTalent.prenom} {selectedTalent.nom}</h2>
                                        <p className="text-primary text-xs uppercase tracking-[0.2em] mt-1 font-semibold">{selectedTalent.specialite}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t('talents.bio')}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {selectedTalent.biographie || t('talents.no_bio')}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                        <div>
                                            <h3 className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground mb-1">{t('talents.current_film')}</h3>
                                            <p className="text-xs font-semibold text-foreground">
                                                {selectedTalent.film ? selectedTalent.film.titre : t('talents.no_project')}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground mb-1">{t('talents.availability')}</h3>
                                            <p className={`text-xs font-semibold ${selectedTalent.disponible ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {selectedTalent.disponible ? t('talents.available') : t('talents.busy')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Personnel;
