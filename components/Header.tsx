import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_UIDS } from '../constants';
import AdminLoginModal from './AdminLoginModal';

const Header: React.FC = () => {
    const { currentUser, login, logout } = useAuth();
    const navigate = useNavigate();
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };
    
    const isAdmin = currentUser && ADMIN_UIDS.includes(currentUser.uid);

    return (
        <>
            <header className="bg-dark-card/50 backdrop-blur-lg sticky top-0 z-50 border-b border-dark-border">
                <nav className="container mx-auto flex items-center justify-between p-4">
                    <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
                        ShowSwap
                    </Link>
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <Link to="/post" className="hidden md:inline-block px-4 py-2 text-sm font-medium rounded-md hover:bg-dark-border transition-colors">Post Ticket</Link>
                                {isAdmin && (
                                    <Link to="/admin" className="hidden md:inline-block px-4 py-2 text-sm font-medium rounded-md hover:bg-dark-border transition-colors">Admin Panel</Link>
                                )}
                                <div className="flex items-center space-x-3">
                                    <img src={currentUser.photoURL || `https://picsum.photos/seed/${currentUser.uid}/40`} alt="profile" className="w-8 h-8 rounded-full"/>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-pink hover:opacity-90 transition-opacity"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                               <button
                                    onClick={login}
                                    className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-purple hover:opacity-90 transition-opacity"
                                >
                                    Login with Google
                                </button>
                                 <button
                                    onClick={() => setIsAdminModalOpen(true)}
                                    className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-600 hover:bg-gray-700 transition-colors"
                                >
                                    Admin Login
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
            <AdminLoginModal 
                isOpen={isAdminModalOpen} 
                onClose={() => setIsAdminModalOpen(false)} 
            />
        </>
    );
};

export default Header;