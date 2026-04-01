import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Films from './pages/Films';
import Scenarios from './pages/Scenarios';
import Personnel from './pages/Personnel';
import Commerce from './pages/Commerce';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AnimatedRoutes() {
  const location = useLocation();

  React.useEffect(() => {
    // Clear admin session if navigating away from admin routes
    if (!location.pathname.startsWith('/admin') && location.pathname !== '/login') {
      sessionStorage.removeItem('isAdmin');
    }
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="films" element={<Films />} />
          <Route path="scenarios" element={<Scenarios />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="commerce" element={<Commerce />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
