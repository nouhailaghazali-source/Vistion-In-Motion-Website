import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Users, Film, FileText, Settings, LogOut, 
    Plus, Edit2, Trash2, Mail, Check, X, AlertCircle, Search, Star, MessageSquare, Reply,
    TrendingUp, TrendingDown, DollarSign, Activity, Globe, Menu, Clapperboard
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- Sub-components moved outside to avoid focus loss during typing ---

const Modal = ({ isOpen, onClose, modalMode, activeTab, formData, setFormData, handleFormSubmit, handleFileChange, previewUrl, setPreviewUrl, currentItem }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-cinema w-full max-w-2xl p-6 sm:p-10 border border-primary/20 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
                        {modalMode === 'add' ? 'Ajouter' : 'Modifier'} {activeTab.slice(0, -1)}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {previewUrl && (
                        <div className="col-span-2 flex justify-center mb-4">
                            <div className="relative group">
                                <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-2xl object-cover border-2 border-primary/20 shadow-xl" />
                                <button type="button" onClick={() => {setPreviewUrl(null); setFormData({...formData, affiche: null, photo: null})}} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'films' && (
                        <>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Titre</label>
                                <input required value={formData.titre || ''} onChange={e => setFormData({...formData, titre: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Réalisateur</label>
                                <input value={formData.realisateur || ''} onChange={e => setFormData({...formData, realisateur: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Genre</label>
                                <input required value={formData.genre || ''} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Année</label>
                                <input type="number" value={formData.annee || ''} onChange={e => setFormData({...formData, annee: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Budget (€)</label>
                                <input type="number" value={formData.budget || ''} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" placeholder="Ex: 1000000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Durée (min)</label>
                                <input type="number" value={formData.duree || ''} onChange={e => setFormData({...formData, duree: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" placeholder="Ex: 120" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Synopsis</label>
                                <textarea value={formData.synopsis || ''} onChange={e => setFormData({...formData, synopsis: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 h-24 text-foreground" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Affiche (Fichier)</label>
                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'affiche')} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 file:bg-primary file:text-primary-foreground file:border-none file:rounded-lg file:px-4 file:py-1 file:mr-4 file:text-xs file:font-black cursor-pointer text-foreground" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ou URL Affiche</label>
                                <input value={formData.affiche_url || ''} onChange={e => setFormData({...formData, affiche_url: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Statut</label>
                                <select required value={formData.statut || ''} onChange={e => setFormData({...formData, statut: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground">
                                    <option value="" className="bg-background text-foreground">Sélectionner</option>
                                    <option value="en_developpement" className="bg-background text-foreground">En Développement</option>
                                    <option value="en_production" className="bg-background text-foreground">En Production</option>
                                    <option value="post_production" className="bg-background text-foreground">Post Production</option>
                                    <option value="distribue" className="bg-background text-foreground">Distribué</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeTab === 'scenarios' && (
                        <>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Titre</label>
                                <input required value={formData.titre || ''} onChange={e => setFormData({...formData, titre: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Auteur</label>
                                <input value={formData.auteur || ''} onChange={e => setFormData({...formData, auteur: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Genre</label>
                                <input value={formData.genre || ''} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</label>
                                <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 h-32 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Statut</label>
                                <select required value={formData.statut || ''} onChange={e => setFormData({...formData, statut: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground">
                                    <option value="" className="bg-background text-foreground">Sélectionner</option>
                                    <option value="en_ecriture" className="bg-background text-foreground">En Écriture</option>
                                    <option value="soumis" className="bg-background text-foreground">Soumis</option>
                                    <option value="approuve" className="bg-background text-foreground">Approuvé</option>
                                    <option value="en_production" className="bg-background text-foreground">En Production</option>
                                    <option value="archive" className="bg-background text-foreground">Archivé</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeTab === 'personnel' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nom</label>
                                <input required value={formData.nom || ''} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Prénom</label>
                                <input required value={formData.prenom || ''} onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rôle</label>
                                <input required value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Spécialité</label>
                                <input value={formData.specialite || ''} onChange={e => setFormData({...formData, specialite: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Téléphone</label>
                                <input value={formData.telephone || ''} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" placeholder="+212..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email</label>
                                <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" placeholder="exemple@mail.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Disponibilité</label>
                                <select value={formData.disponible !== undefined ? formData.disponible : true} onChange={e => setFormData({...formData, disponible: e.target.value === 'true'})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground">
                                    <option value="true" className="bg-background text-foreground">Disponible</option>
                                    <option value="false" className="bg-background text-foreground">Indisponible</option>
                                </select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Photo (Fichier)</label>
                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'photo')} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 file:bg-primary file:text-primary-foreground file:border-none file:rounded-lg file:px-4 file:py-1 file:mr-4 file:text-xs file:font-black cursor-pointer text-foreground" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ou URL Photo</label>
                                <input value={formData.photo_url || ''} onChange={e => setFormData({...formData, photo_url: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" placeholder="https://..." />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Biographie</label>
                                <textarea value={formData.biographie || ''} onChange={e => setFormData({...formData, biographie: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 h-32 text-foreground" />
                            </div>
                        </>
                    )}

                    {activeTab === 'commerce' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type</label>
                                <select required value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground">
                                    <option value="" className="bg-background text-foreground">Sélectionner</option>
                                    <option value="importation" className="bg-background text-foreground">Importation</option>
                                    <option value="exportation" className="bg-background text-foreground">Exportation</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valeur (€)</label>
                                <input type="number" value={formData.valeur || ''} onChange={e => setFormData({...formData, valeur: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Statut</label>
                                <select required value={formData.statut || ''} onChange={e => setFormData({...formData, statut: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground">
                                    <option value="" className="bg-background text-foreground">Sélectionner</option>
                                    <option value="en_cours" className="bg-background text-foreground">En cours</option>
                                    <option value="complete" className="bg-background text-foreground">Complété</option>
                                    <option value="annule" className="bg-background text-foreground">Annulé</option>
                                </select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</label>
                                <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 h-24 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date Opération</label>
                                <input type="date" value={formData.date_operation || ''} onChange={e => setFormData({...formData, date_operation: e.target.value})} className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 text-foreground" />
                            </div>
                        </>
                    )}

                    <div className="col-span-2 pt-6">
                        <button type="submit" className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all">
                            {modalMode === 'add' ? 'Enregistrer' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const DashboardView = ({ data }) => (
    <div className="space-y-8">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mb-8 sm:mb-12">Statistiques Studio</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            <div className="card-cinema p-6 border border-border">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">Total Films</h3>
                <p className="text-3xl font-black">{data.films.length}</p>
            </div>
            <div className="card-cinema p-6 border border-border">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">Scénarios</h3>
                <p className="text-3xl font-black">{data.scenarios.length}</p>
            </div>
            <div className="card-cinema p-6 border border-border">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">Talents</h3>
                <p className="text-3xl font-black">{data.personnel.length}</p>
            </div>
            <div className="card-cinema p-6 border border-border text-primary">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">Commerce</h3>
                <p className="text-3xl font-black">{data.commerce.length}</p>
            </div>
            <div className="card-cinema p-6 border border-border">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">Contact</h3>
                <p className="text-3xl font-black text-primary">{data.messages.filter(m => !m.target_id).length}</p>
            </div>
            <div className="card-cinema p-6 border border-border">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">Feedbacks</h3>
                <p className="text-3xl font-black text-amber-500">{data.messages.filter(m => m.target_id).length}</p>
            </div>
        </div>
    </div>
);

const CommerceView = ({ commerce, openModal, handleDelete, films }) => {
    const stats = React.useMemo(() => {
        const totalImport = commerce.filter(op => op.type === 'importation' && op.statut !== 'annule').reduce((acc, op) => acc + Number(op.valeur), 0);
        const totalExport = commerce.filter(op => op.type === 'exportation' && op.statut !== 'annule').reduce((acc, op) => acc + Number(op.valeur), 0);
        return { totalImport, totalExport, balance: totalExport - totalImport };
    }, [commerce]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">Dashboard Financier</h1>
                    <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest">Vision in Motion - Commerce</p>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="card-cinema p-6 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><TrendingDown className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Import</span>
                    </div>
                    <p className="text-2xl font-black">{stats.totalImport.toLocaleString()} €</p>
                </div>
                <div className="card-cinema p-6 border-l-4 border-l-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Export</span>
                    </div>
                    <p className="text-2xl font-black">{stats.totalExport.toLocaleString()} €</p>
                </div>
                <div className="card-cinema p-6 border-l-4 border-l-primary">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Activity className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Balance</span>
                    </div>
                    <p className={`text-2xl font-black ${stats.balance >= 0 ? 'text-primary' : 'text-red-500'}`}>{stats.balance.toLocaleString()} €</p>
                </div>
            </div>

            {/* Operations List */}
            <ListView 
                title="Liste des Opérations" 
                type="commerce" 
                items={commerce} 
                columns={[
                    { key: 'type', label: 'Type' },
                    { key: 'description', label: 'Description' },
                    { key: 'valeur', label: 'Valeur (€)' },
                    { key: 'statut', label: 'Statut' }
                ]} 
                openModal={openModal}
                handleDelete={handleDelete}
                films={films}
            />
        </div>
    );
};

const ListView = ({ title, type, items, columns, openModal, handleDelete, films = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredItems = React.useMemo(() => {
        return items.filter(item => {
            const searchStr = (item.titre || item.nom || item.description || item.pays_partenaire || '').toLowerCase();
            const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
            
            if (type === 'commerce' && filterType !== 'all') {
                return matchesSearch && item.type === filterType;
            }
            return matchesSearch;
        });
    }, [items, searchTerm, filterType, type]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">{title}</h1>
                    <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest">Gestion des ressources</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-muted/20 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                        />
                    </div>
                    {type === 'commerce' && (
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-muted/20 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                        >
                            <option value="all">Tous</option>
                            <option value="importation">Importations</option>
                            <option value="exportation">Exportations</option>
                        </select>
                    )}
                    <button 
                        onClick={() => openModal('add')}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all flex-1 lg:flex-none"
                    >
                        <Plus className="w-4 h-4" /> Ajouter
                    </button>
                </div>
            </div>

            <div className="card-cinema border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-muted/30 border-b border-border">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                                {columns.map(col => (
                                    <td key={col.key} className="px-6 py-4 text-sm font-medium text-foreground">
                                            {col.isImage ? (
                                                item[col.key] ? (
                                                    <img src={item[col.key]} alt="" className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center text-[10px] text-muted-foreground">N/A</div>
                                                )
                                            ) : col.isStatus ? (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${item[col.key] ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                                                        {item[col.key] ? 'Libre' : 'Occupé'}
                                                    </span>
                                                </div>
                                            ) : col.key === 'film_id' ? (
                                                films.find(f => f.id === item.film_id)?.titre || 'Général'
                                            ) : (
                                                item[col.key] || '—'
                                            )}
                                        </td>
                                ))}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => openModal('edit', item)}
                                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(type, item.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                {filteredItems.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground italic text-sm">Aucun élément trouvé</div>
                )}
            </div>
        </div>
    );
};

const MessagesView = ({ messages, type, handleDelete }) => {
    // type can be 'contact' or 'feedback'
    const filteredMessages = messages.filter(msg => {
        if (type === 'contact') return !msg.target_id;
        return msg.target_id;
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">
                {type === 'contact' ? 'Messages de Contact' : 'Évaluations Projets'}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mb-8 sm:mb-12">
                {type === 'contact' ? 'Demandes de renseignements' : 'Notes et avis clients'}
            </p>

            <div className="grid grid-cols-1 gap-6">
                {filteredMessages.map(msg => (
                    <div key={msg.id} className="card-cinema p-6 sm:p-8 border border-border hover:border-primary/50 transition-all group">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <h4 className="font-black text-lg text-foreground">{msg.nom}</h4>
                                <p className="text-primary text-xs font-bold">{msg.email}</p>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <span className="text-[10px] text-muted-foreground font-medium bg-muted/20 px-3 py-1 rounded-full uppercase tracking-widest">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    {type === 'contact' && (
                                        <a 
                                            href={`mailto:${msg.email}?subject=Re: ${msg.sujet || 'Contact Vision Studio'}`}
                                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                            title="Répondre par email"
                                        >
                                            <Reply className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => handleDelete('contact', msg.id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                                {type === 'feedback' ? 'Projet:' : 'Sujet:'}
                            </span>
                            <p className="font-bold text-foreground">{msg.sujet || 'Sans sujet'}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Message:</span>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">"{msg.message}"</p>
                        </div>
                        {msg.note && (
                            <div className="mt-4 flex items-center gap-2 text-amber-500">
                                <span className="text-[10px] font-black uppercase tracking-widest">Note:</span>
                                <Star className="w-4 h-4 fill-amber-500" />
                                <span className="font-bold text-sm">{msg.note}/5</span>
                            </div>
                        )}
                    </div>
                ))}
                {filteredMessages.length === 0 && (
                    <div className="card-cinema p-20 border border-dashed border-border text-center text-muted-foreground italic">
                        Aucun message de ce type pour le moment
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main AdminDashboard Component ---

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [data, setData] = useState({
        films: [],
        scenarios: [],
        personnel: [],
        commerce: [],
        messages: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [filmsRes, scenariosRes, personnelRes, commerceRes, messagesRes] = await Promise.all([
                axios.get('/api/films'),
                axios.get('/api/scenarios'),
                axios.get('/api/personnel'),
                axios.get('/api/commerce'),
                axios.get('/api/contact')
            ]);
            setData({
                films: filmsRes.data,
                scenarios: scenariosRes.data,
                personnel: personnelRes.data,
                commerce: commerceRes.data,
                messages: messagesRes.data
            });
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Erreur lors de la récupération des données');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout').catch(() => {});
            sessionStorage.removeItem('isAdmin');
            navigate('/login');
        } catch (err) {
            sessionStorage.removeItem('isAdmin');
            navigate('/login');
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet élément ?')) return;
        try {
            await axios.delete(`/api/${type}/${id}`);
            fetchData(); // Refresh
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [field]: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const openModal = (mode, item = null) => {
        setModalMode(mode);
        setCurrentItem(item);
        setPreviewUrl(null);
        window.allFilms = data.films; // Make films available to Modal component via global window
        if (mode === 'edit' && item) {
            setFormData(item);
            setPreviewUrl(item.affiche_url || item.photo_url || null);
        } else {
            setFormData({});
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = new FormData();
            
            // Define allowed fields for each tab to avoid sending relations/internal IDs
            const allowedFields = {
                films: ['titre', 'realisateur', 'genre', 'annee', 'budget', 'duree', 'synopsis', 'statut', 'affiche', 'affiche_url'],
                scenarios: ['titre', 'auteur', 'genre', 'description', 'statut', 'film_id'],
                personnel: ['nom', 'prenom', 'role', 'specialite', 'biographie', 'photo', 'photo_url', 'telephone', 'email', 'disponible', 'film_id'],
                commerce: ['type', 'mode_operation', 'film_id', 'pays_partenaire', 'valeur', 'devise', 'description', 'statut', 'date_operation']
            };

            const currentAllowed = allowedFields[activeTab];

            Object.keys(formData).forEach(key => {
                if (!currentAllowed.includes(key)) return;

                // Don't send current photo/affiche URL if we are uploading a new file
                if (key === 'affiche_url' && formData.affiche) return;
                if (key === 'photo_url' && formData.photo) return;

                if (formData[key] !== null && formData[key] !== undefined) {
                    dataToSend.append(key, formData[key]);
                }
            });

            // Laravel needs _method: 'PUT' for multipart/form-data updates
            if (modalMode === 'edit') {
                dataToSend.append('_method', 'PUT');
            }

            const url = modalMode === 'add' ? `/api/${activeTab}` : `/api/${activeTab}/${currentItem.id}`;
            await axios.post(url, dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsModalOpen(false);
            setPreviewUrl(null);
            fetchData();
        } catch (err) {
            alert('Erreur lors de l\'enregistrement : ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-30">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                        <Clapperboard className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter text-foreground leading-none">
                            VISION IN <span className="text-primary">MOTION</span>
                        </span>
                        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mt-0.5">Studio Production</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-xl bg-muted/20 text-muted-foreground"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 w-64 border-r border-border p-6 flex flex-col bg-background z-50 transition-transform duration-300 lg:translate-x-0 lg:static
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="hidden lg:flex items-center gap-3 mb-12 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg shadow-primary/5">
                        <Clapperboard className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-500 leading-none">
                            VISION IN <span className="text-primary">MOTION</span>
                        </span>
                        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mt-1">Studio Production</span>
                    </div>
                </div>

                <nav className="space-y-1 flex-1">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'films', label: 'Films', icon: Film },
                        { id: 'scenarios', label: 'Scénarios', icon: FileText },
                        { id: 'personnel', label: 'Talents', icon: Users },
                        { id: 'commerce', label: 'Commerce', icon: Settings },
                        { id: 'messages', label: 'Contact', icon: Mail },
                        { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-all ${
                                activeTab === tab.id 
                                ? 'bg-primary/10 text-primary' 
                                : 'text-muted-foreground hover:bg-muted/50'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </nav>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 text-red-500 font-bold text-sm transition-all mt-auto"
                >
                    <LogOut className="w-4 h-4" /> Déconnexion
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 sm:p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'dashboard' && <DashboardView data={data} />}
                        {activeTab === 'films' && (
                            <ListView 
                                title="Films" 
                                type="films" 
                                items={data.films} 
                                columns={[
                                    { key: 'affiche_url', label: 'Affiche', isImage: true },
                                    { key: 'titre', label: 'Titre' },
                                    { key: 'realisateur', label: 'Réalisateur' },
                                    { key: 'budget', label: 'Budget (€)' },
                                    { key: 'duree', label: 'Durée (min)' },
                                    { key: 'statut', label: 'Statut' }
                                ]} 
                                openModal={openModal}
                                handleDelete={handleDelete}
                            />
                        )}
                        {activeTab === 'scenarios' && (
                            <ListView 
                                title="Scénarios" 
                                type="scenarios" 
                                items={data.scenarios} 
                                columns={[
                                    { key: 'titre', label: 'Titre' },
                                    { key: 'auteur', label: 'Auteur' },
                                    { key: 'genre', label: 'Genre' },
                                    { key: 'description', label: 'Description' },
                                    { key: 'statut', label: 'Statut' }
                                ]} 
                                openModal={openModal}
                                handleDelete={handleDelete}
                            />
                        )}
                        {activeTab === 'personnel' && (
                            <ListView 
                                title="Talents" 
                                type="personnel" 
                                items={data.personnel} 
                                columns={[
                                    { key: 'photo_url', label: 'Photo', isImage: true },
                                    { key: 'nom', label: 'Nom' },
                                    { key: 'prenom', label: 'Prénom' },
                                    { key: 'role', label: 'Rôle' },
                                    { key: 'email', label: 'Email' },
                                    { key: 'disponible', label: 'Dispo', isStatus: true }
                                ]} 
                                openModal={openModal}
                                handleDelete={handleDelete}
                            />
                        )}
                        {activeTab === 'commerce' && (
                            <CommerceView 
                                commerce={data.commerce} 
                                openModal={openModal}
                                handleDelete={handleDelete}
                                films={data.films}
                            />
                        )}
                        {activeTab === 'messages' && (
                            <MessagesView 
                                messages={data.messages} 
                                type="contact" 
                                handleDelete={handleDelete} 
                            />
                        )}
                        {activeTab === 'feedbacks' && (
                            <MessagesView 
                                messages={data.messages} 
                                type="feedback" 
                                handleDelete={handleDelete} 
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modal for Add/Edit */}
            <Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalMode={modalMode}
                activeTab={activeTab}
                formData={formData}
                setFormData={setFormData}
                handleFormSubmit={handleFormSubmit}
                handleFileChange={handleFileChange}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                currentItem={currentItem}
            />
        </div>
    );
};

export default AdminDashboard;
