import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Home, FileText, Users, Globe, Mail, Moon, Sun, Languages, ChevronDown, Instagram, Facebook, Linkedin, Twitter, MapPin, Phone, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isDark, setIsDark] = useState(true);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const languages = [
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ar', label: 'العربية', flag: '🇲🇦' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsLangOpen(false);
    };

    const navItems = [
        { path: '/', label: t('nav.home'), icon: Home },
        { path: '/films', label: t('nav.productions'), icon: Clapperboard },
        { path: '/scenarios', label: t('nav.scenarios'), icon: FileText },
        { path: '/personnel', label: t('nav.talents'), icon: Users },
        { path: '/commerce', label: t('nav.commerce'), icon: Globe },
        { path: '/contact', label: t('nav.contact'), icon: Mail },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Smooth Navbar with Blur */}
            {/* Premium Cinematic Navbar */}
            <header className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 h-20 flex items-center ${
                isMenuOpen ? 'bg-background/98' : 'bg-background/60 backdrop-blur-2xl border-b border-white/5'
            }`}>
                <div className="w-full max-w-[1600px] mx-auto px-8 flex justify-between items-center relative">
                    
                    {/* Brand/Logo - Left */}
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg shadow-primary/5">
                            <Clapperboard className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-500 leading-none">
                                VISION IN <span className="text-primary">MOTION</span>
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mt-1">Studio Production</span>
                        </div>
                    </Link>
                    
                    {/* Navigation - Absolute Centered for perfect symmetry */}
                    <nav className="hidden xl:flex items-center absolute left-1/2 -translate-x-1/2 gap-8">
                        {navItems.map((item) => (
                            <Link 
                                key={item.path}
                                to={item.path}
                                className="relative py-2 group"
                            >
                                <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
                                    location.pathname === item.path ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                }`}>
                                    {item.label}
                                </span>
                                {/* Animated underline */}
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                                    location.pathname === item.path ? 'scale-x-100' : ''
                                }`} />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions - Right */}
                    <div className="flex items-center gap-2 sm:gap-4 relative z-10">
                        {/* Language Switcher - Desktop/Tablet */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-muted/20 hover:bg-muted/40 border border-white/5 transition-all text-muted-foreground hover:text-foreground group"
                            >
                                <Languages className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{i18n.language}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-48 py-3 bg-card/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-20"
                                        >
                                            <div className="px-4 py-2 mb-2 border-b border-white/5">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Choisir la langue</span>
                                            </div>
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => changeLanguage(lang.code)}
                                                    className={`w-full px-4 py-2.5 text-left text-[11px] font-black flex items-center gap-4 transition-all hover:bg-primary/10 group ${
                                                        i18n.language === lang.code ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    <span className="text-base grayscale group-hover:grayscale-0 transition-all">{lang.flag}</span>
                                                    <span className="uppercase tracking-widest">{lang.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 border border-white/5 transition-all text-muted-foreground hover:text-primary"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`xl:hidden p-2.5 rounded-xl transition-all duration-500 shadow-lg ${
                                isMenuOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary shadow-primary/5'
                            }`}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Overlay - Premium Fullscreen */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            {/* Backdrop Blur Layer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="lg:hidden fixed inset-0 z-[55] bg-background/40 backdrop-blur-md"
                            />
                            
                            <motion.div
                                initial={{ opacity: 0, y: '-100%', scale: 1.1 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: '-100%', scale: 1.1 }}
                                transition={{ 
                                    type: 'spring', 
                                    damping: 35, 
                                    stiffness: 300,
                                    mass: 0.8
                                }}
                                className="xl:hidden fixed inset-0 z-[60] bg-background/98 backdrop-blur-3xl flex flex-col pt-24"
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="absolute top-6 right-8 p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground hover:text-primary transition-all duration-300 z-[70]"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Decorative Gradient Blobs */}
                                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                                {/* Navigation Links */}
                                <nav className="flex-1 flex flex-col justify-center py-4 px-8 space-y-2 relative z-10 overflow-hidden">
                                    {/* Faint Background Logo */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none">
                                        <Clapperboard className="w-80 h-80" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto w-full">
                                        {navItems.map((item, index) => (
                                            <motion.div
                                                key={item.path}
                                                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                transition={{ 
                                                    delay: 0.15 + index * 0.08,
                                                    duration: 0.5,
                                                    ease: [0.22, 1, 0.36, 1]
                                                }}
                                            >
                                                <Link 
                                                    to={item.path}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={`group relative flex items-center justify-between p-5 rounded-[1.8rem] transition-all duration-500 overflow-hidden ${
                                                        location.pathname === item.path 
                                                        ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20' 
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/5'
                                                    }`}
                                                >
                                                    {/* Hover Glow Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    
                                                    <div className="flex items-center gap-5 relative z-10">
                                                        <div className={`p-3 rounded-xl transition-all duration-500 transform group-hover:scale-110 ${
                                                            location.pathname === item.path ? 'bg-white/20 text-white' : 'bg-muted/20 text-muted-foreground group-hover:text-primary'
                                                        }`}>
                                                            <item.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                                                            <span className={`text-[7px] font-bold uppercase tracking-widest mt-0.5 opacity-60 ${
                                                                location.pathname === item.path ? 'text-white/80' : 'text-muted-foreground'
                                                            }`}>
                                                                {item.path.replace('/', '') || 'Accueil'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
                                                        location.pathname === item.path ? 'bg-white scale-125' : 'bg-primary opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                                                    }`} />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </nav>
                                
                                {/* Footer in Overlay */}
                                <div className="p-6 sm:p-8 border-t border-white/5 bg-black/20 backdrop-blur-md z-10">
                                    <div className="flex flex-col gap-4 max-w-md mx-auto sm:mx-0">
                                        <div className="flex items-center justify-between text-muted-foreground/30 text-[7px] font-black uppercase tracking-[0.5em] px-2 pt-2">
                                            <span>Vision in Motion</span>
                                            <div className="flex gap-4">
                                                <div className="w-1 h-1 rounded-full bg-primary/30" />
                                                <div className="w-1 h-1 rounded-full bg-primary/30" />
                                                <div className="w-1 h-1 rounded-full bg-primary/30" />
                                            </div>
                                            <span>© 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {/* Page Transition Wrapper */}
            <main className="flex-grow pt-20">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Refined Modern Footer */}
            <footer className="relative mt-20 pt-20 pb-12 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-5 space-y-8">
                            <Link to="/" className="inline-flex items-center gap-3 group">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                    <Clapperboard className="w-6 h-6" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-500">
                                    VISION IN <span className="text-primary">MOTION</span>
                                </span>
                            </Link>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium opacity-80">
                                {t('footer.description')}
                            </p>
                        </div>

                        {/* Navigation Section */}
                        <div className="lg:col-span-3 lg:pl-12">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">
                                {t('footer.navigation')}
                            </h4>
                            <ul className="space-y-4">
                                {navItems.map(item => (
                                    <li key={item.path}>
                                        <Link 
                                            to={item.path} 
                                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-all flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div className="lg:col-span-4">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">
                                {t('nav.contact')}
                            </h4>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 p-2 rounded-lg bg-muted/10 text-primary group-hover:bg-primary/20 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Email</span>
                                        <p className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer">{t('contact.email')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 p-2 rounded-lg bg-muted/10 text-primary group-hover:bg-primary/20 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">WhatsApp / Call</span>
                                        <p className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer">{t('contact.phone')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 p-2 rounded-lg bg-muted/10 text-primary group-hover:bg-primary/20 transition-colors">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Studio</span>
                                        <p className="text-sm font-bold text-foreground leading-relaxed max-w-[250px]">{t('contact.address')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} <span className="text-primary">VISION IN MOTION</span>. {t('footer.rights')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
