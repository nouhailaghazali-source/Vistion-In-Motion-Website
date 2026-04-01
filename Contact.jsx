import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign, Type, Clock, ChevronDown, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        {
            question: t('contact.faq.q1'),
            answer: t('contact.faq.a1')
        },
        {
            question: t('contact.faq.q2'),
            answer: t('contact.faq.a2')
        },
        {
            question: t('contact.faq.q3'),
            answer: t('contact.faq.a3')
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post('/api/contact', {
            nom: formData.name,
            email: formData.email,
            sujet: formData.subject,
            message: formData.message
        })
            .then(response => {
                console.log('Message envoyé avec succès:', response.data);
                setStatus({ type: 'success', message: t('contact.form.success') });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi du message:', error.response ? error.response.data : error.message);
                setStatus({ type: 'danger', message: t('contact.form.error') });
                setLoading(false);
            });
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-primary uppercase">{t('contact.title')}</h2>
                <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] mt-4">{t('contact.subtitle')}</p>
                <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mt-6" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto mb-24">
                {/* Info Column */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-8"
                >
                    <div className="card-cinema p-8 backdrop-blur-xl">
                        <h4 className="text-xl font-bold mb-8 text-foreground uppercase tracking-tight">{t('contact.offices')}</h4>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-1">{t('contact.address_title')}</span>
                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                        {t('contact.address')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-1">{t('contact.email_title')}</span>
                                    <p className="text-sm font-medium text-foreground">{t('contact.email')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-1">{t('contact.phone_title')}</span>
                                    <p className="text-sm font-medium text-foreground">{t('contact.phone')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-border">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-2">{t('contact.hours')}</span>
                                    <div className="space-y-1 text-foreground">
                                        <p className="text-xs font-medium flex justify-between gap-8">
                                            <span>{t('contact.schedule.week')}</span>
                                            <span className="text-primary">09:00 - 18:00</span>
                                        </p>
                                        <p className="text-xs font-medium flex justify-between gap-8">
                                            <span>{t('contact.schedule.saturday')}</span>
                                            <span className="text-primary">10:00 - 14:00</span>
                                        </p>
                                        <p className="text-[10px] text-muted-foreground italic mt-2">{t('contact.schedule.sunday')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form Column */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2"
                >
                    <div className="card-cinema p-10 backdrop-blur-xl relative h-full">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                            <MessageSquare className="w-64 h-64" />
                        </div>

                        <h4 className="text-xl font-bold mb-8 text-foreground uppercase tracking-tight">{t('contact.send_message')}</h4>
                        
                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl mb-8 text-sm font-bold border ${
                                    status.type === 'success' 
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}
                            >
                                {status.message}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('contact.form.name')}</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input 
                                            type="text" id="name" required placeholder={t('contact.form.placeholder_name')}
                                            value={formData.name} onChange={handleChange}
                                            className="w-full bg-muted/20 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('contact.email_title')}</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input 
                                            type="email" id="email" required placeholder="votre@email.com"
                                            value={formData.email} onChange={handleChange}
                                            className="w-full bg-muted/20 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('contact.form.subject')}</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input 
                                        type="text" id="subject" required placeholder={t('contact.form.placeholder_subject')}
                                        value={formData.subject} onChange={handleChange}
                                        className="w-full bg-muted/20 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{t('contact.form.message')}</label>
                                <textarea 
                                    id="message" required rows="5" placeholder={t('contact.form.placeholder_message')}
                                    value={formData.message} onChange={handleChange}
                                    className="w-full bg-muted/20 border border-border rounded-2xl p-6 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground resize-none"
                                ></textarea>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" disabled={loading}
                                className="w-full py-5 mt-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> {t('contact.form.submit')}
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Google Maps Section */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-24"
            >
                <div className="card-cinema overflow-hidden h-[450px] border border-white/5 relative group">
                    <iframe 
                        title="Vision in Motion Témara"
                        src={`https://www.google.com/maps?q=Lotissement+Sahb,+immeuble+C,+bureau+14+Av.+Moulay+Hassan+I,+Témara&output=embed&hl=${i18n.language}`}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="absolute inset-0 pointer-events-none border-[20px] border-background/20 group-hover:border-background/10 transition-all duration-500" />
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto mb-12"
            >
                <div className="text-center mb-12">
                    <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                    <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter">{t('contact.faq.title')}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{t('contact.faq.subtitle')}</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="card-cinema overflow-hidden">
                            <button 
                                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/10 transition-all"
                            >
                                <span className="font-bold text-foreground tracking-tight">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-primary" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {activeFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border bg-muted/5">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
