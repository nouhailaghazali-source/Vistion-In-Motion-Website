import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import FeaturedMovies from '../components/FeaturedMovies';

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/stats')
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching stats:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <Hero />

            {/* Stats Summary Section */}
            <Stats stats={stats} loading={loading} />

            {/* Featured Movies Section */}
            <FeaturedMovies />

            {/* Services Grid Section */}
            <Services />
        </div>
    );
};

export default Home;
