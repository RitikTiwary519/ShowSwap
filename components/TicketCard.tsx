import React from 'react';
import type { Ticket } from '../types';
import { motion } from 'framer-motion';

interface TicketCardProps {
    ticket: Ticket;
    onClick: () => void;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    const iconMap: { [key: string]: string } = {
        Concert: '🎵', Festival: '🎪', Garba: '💃', Flight: '✈️', Train: '🚂', Other: '🎫'
    };
    return <span className="text-2xl mr-3">{iconMap[category] || '🎫'}</span>;
};

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
    const eventDate = new Date(ticket.eventDate);
    const formattedDate = eventDate.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.4)" }}
            onClick={onClick}
            className="bg-dark-card rounded-xl overflow-hidden border border-dark-border cursor-pointer flex flex-col justify-between"
        >
            <div className="p-5">
                <div className="flex items-center mb-3">
                    <CategoryIcon category={ticket.category} />
                    <div>
                        <p className="text-xs text-brand-purple font-semibold">{ticket.category}</p>
                        <h3 className="font-bold text-lg leading-tight text-gray-100">{ticket.eventName}</h3>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">
                    <span className="font-semibold">Date:</span> {formattedDate}
                </p>
                {ticket.artist && <p className="text-sm text-gray-400 truncate"><span className="font-semibold">Artist:</span> {ticket.artist}</p>}
                {ticket.venue && <p className="text-sm text-gray-400 truncate"><span className="font-semibold">Venue:</span> {ticket.venue}</p>}
                {ticket.departure && <p className="text-sm text-gray-400"><span className="font-semibold">From:</span> {ticket.departure} <span className="font-semibold">To:</span> {ticket.arrival}</p>}
            </div>
            <div className="bg-dark-border/50 px-5 py-3 flex justify-between items-center">
                <p className="text-sm text-gray-300">
                    Sold by <span className="font-semibold">{ticket.sellerName}</span>
                </p>
                <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    ${ticket.price}
                </p>
            </div>
        </motion.div>
    );
};

export default TicketCard;