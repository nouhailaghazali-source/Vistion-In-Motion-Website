import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, User, AtSign, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const FeedbackModal = ({ isOpen, onClose, targetId, targetTitle, targetType }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 5,
        comment: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/contact', {
                nom: formData.name,
                email: formData.email,
                sujet: `Feedback: ${targetType} - ${targetTitle}`,
                note: formData.rating,
                target_id: targetId,
                target_type: targetType.toLowerCase(),
                message: formData.comment
            });
            setStatus({ type: 'success', message: t('contact.form.success') });
            setTimeout(() => {
                onClose();
                setFormData({ name: '', email: '', rating: 5, comment: '' });
                setStatus(null);
                // Optionnel: rafraîchir la page ou les données pour voir la nouvelle moyenne
                window.location.reload();
            }, 2000);
        } catch (error) {
            setStatus({ type: 'danger', message: t('contact.form.error') });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-card border border-border rounded-[2.5rem] w-full max-w-lg overflow-hidden relative shadow-2xl"
                    >
                        <div className="p-8 md:p-12">
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-all p-2 rounded-full hover:bg-muted/20"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Feedback</span>
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none mb-2">
                                    {targetTitle}
                                </h2>
                                <p className="text-muted-foreground text-[10px] uppercase tracking-widest opacity-60">
                                    {t('common.feedback_subtitle', 'Partagez votre avis sur ce projet')}
                                </p>
                            </div>

                            {status && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl mb-8 text-xs font-bold border ${
                                        status.type === 'success' 
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}
                                >
                                    {status.message}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('contact.form.name')}</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input 
                                            type="text" required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-muted/20 border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                                            placeholder={t('contact.form.placeholder_name')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input 
                                            type="email" required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-muted/20 border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Note</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({...formData, rating: star})}
                                                className={`p-2 rounded-lg transition-all ${formData.rating >= star ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-muted/10'}`}
                                            >
                                                <Star className={`w-5 h-5 ${formData.rating >= star ? 'fill-primary' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Commentaire</label>
                                    <textarea 
                                        required rows="4"
                                        value={formData.comment}
                                        onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                        className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground resize-none"
                                        placeholder={t('contact.form.placeholder_message')}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" disabled={loading}
                                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> {t('contact.form.submit')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackModal;
