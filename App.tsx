
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PostTicketPage from './pages/PostTicketPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ADMIN_UIDS } from './constants';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <div className="min-h-screen bg-dark-bg font-sans">
                    <Header />
                    <main className="container mx-auto p-4 md:p-8">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/post" element={
                                <ProtectedRoute>
                                    <PostTicketPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin" element={
                                <ProtectedRoute adminOnly={true} adminUids={ADMIN_UIDS}>
                                    <AdminPage />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                </div>
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
