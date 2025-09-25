import React from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import { motion } from 'framer-motion';


const PostTicketPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        // Optionally show a success message before redirecting
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
        >
            <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
                Sell Your Ticket
            </h1>
            <p className="text-center text-gray-400 mb-8">Fill in the details below to list your ticket on ShowSwap.</p>
            <div className="bg-dark-card p-8 rounded-lg border border-dark-border">
                <TicketForm onSuccess={handleSuccess} />
            </div>
        </motion.div>
    );
};

export default PostTicketPage;