import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, TrendingDown, Clock, Search, Filter, DollarSign, PieChart, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Commerce = () => {
    const { t } = useTranslation();
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        axios.get('/api/commerce')
            .then(response => {
                setOperations(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching operations:", error);
                setLoading(false);
            });
    }, []);

    // Financial calculations
    const stats = useMemo(() => {
        const totalImport = operations
            .filter(op => op.type === 'importation' && op.statut !== 'annule')
            .reduce((acc, op) => acc + Number(op.valeur), 0);
        
        const totalExport = operations
            .filter(op => op.type === 'exportation' && op.statut !== 'annule')
            .reduce((acc, op) => acc + Number(op.valeur), 0);

        return {
            totalImport,
            totalExport,
            balance: totalExport - totalImport
        };
    }, [operations]);

    // Chart data preparation
    const chartData = useMemo(() => {
        // Simple mock trend based on current data for visualization
        return operations
            .slice()
            .reverse()
            .map((op, i) => ({
                name: op.date_operation || `Op ${i}`,
                value: Number(op.valeur)
            }));
    }, [operations]);

    // Filtering logic
    const filteredOperations = useMemo(() => {
        return operations.filter(op => {
            const matchesSearch = op.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                op.pays_partenaire?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || op.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [operations, searchTerm, filterType]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'en_cours': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'complete': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'annule': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-muted-foreground bg-muted/10 border-white/10';
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
            >
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-primary uppercase text-foreground">{t('commerce.title')}</h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] mt-2 opacity-70">{t('commerce.subtitle')}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto text-foreground">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder={t('commerce.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-muted/20 border border-border rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-muted/20 border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                    >
                        <option value="all" className="bg-background text-foreground">{t('commerce.filter_all')}</option>
                        <option value="importation" className="bg-background text-foreground">{t('commerce.import')}</option>
                        <option value="exportation" className="bg-background text-foreground">{t('commerce.export')}</option>
                    </select>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Financial Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-cinema p-8 border-l-4 border-l-blue-500"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                    <TrendingDown className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('commerce.stats.total_import')}</span>
                            </div>
                            <div className="text-3xl font-black text-foreground tracking-tighter">
                                {stats.totalImport.toLocaleString()} <span className="text-xl text-foreground ml-1">€</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card-cinema p-8 border-l-4 border-l-emerald-500"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('commerce.stats.total_export')}</span>
                            </div>
                            <div className="text-3xl font-black text-foreground tracking-tighter">
                                {stats.totalExport.toLocaleString()} <span className="text-xl text-foreground ml-1">€</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card-cinema p-8 border-l-4 border-l-primary"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('commerce.stats.balance')}</span>
                            </div>
                            <div className={`text-3xl font-black tracking-tighter ${stats.balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                {stats.balance.toLocaleString()} <span className="text-xl ml-1">€</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Table Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card-cinema overflow-hidden border border-border shadow-2xl bg-muted/10 backdrop-blur-xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-muted/20">
                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t('commerce.table.desc')}</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t('commerce.table.type')}</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">{t('commerce.table.value')}</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">{t('commerce.table.status')}</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">{t('commerce.table.date')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredOperations.map((op, i) => (
                                        <motion.tr 
                                            key={op.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-muted/10 transition-colors group"
                                        >
                                            <td className="p-6">
                                                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{op.description}</div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 uppercase font-black tracking-widest">
                                                    <Globe className="w-3 h-3" />
                                                    {op.pays_partenaire || t('films.location')}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    {op.type === 'importation' ? (
                                                        <TrendingDown className="w-4 h-4 text-blue-400" />
                                                    ) : (
                                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                    )}
                                                    <span className="text-xs font-bold uppercase tracking-wider">
                                                        {op.type === 'importation' ? t('commerce.import') : t('commerce.export')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="text-sm font-black text-primary">{op.valeur.toLocaleString()} €</div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${getStatusClass(op.statut)}`}>
                                                    {op.statut === 'complete' ? t('commerce.table.completed') : op.statut.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    {op.date_operation || t('common.loading')}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {filteredOperations.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-20 text-center text-muted-foreground italic uppercase tracking-widest text-sm">
                                                {t('commerce.table.no_results')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default Commerce;
