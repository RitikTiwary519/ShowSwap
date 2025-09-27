
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import SiteDown from './pages/SiteDown';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostTicketPage from './pages/PostTicketPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ADMIN_UIDS } from './constants';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <div className="min-h-screen flex flex-col bg-dark-bg font-sans">
                    <SiteDown />
                </div>
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
