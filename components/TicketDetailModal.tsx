import React from 'react';
import type { Ticket } from '../types';
import { motion } from 'framer-motion';

interface TicketDetailModalProps {
    ticket: Ticket;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string, value?: string | number }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="py-2">
            <p className="text-sm font-semibold text-gray-400">{label}</p>
            <p className="text-md text-gray-100">{value}</p>
        </div>
    );
};

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
    const eventDate = new Date(ticket.eventDate).toLocaleString(undefined, {
        dateStyle: 'full',
        timeStyle: 'short'
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-card rounded-xl border border-dark-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                         <div>
                            <p className="text-sm text-brand-purple font-semibold">{ticket.category}</p>
                            <h2 className="text-2xl font-bold text-gray-100">{ticket.eventName}</h2>
                         </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
                    </div>

                    <div className="mt-4 border-t border-dark-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailRow label="Event Date" value={eventDate} />
                        <DetailRow label="Price" value={`₹${ticket.price}`} />
                        <DetailRow label="Venue" value={ticket.venue} />
                        <DetailRow label="Artist/Performer" value={ticket.artist} />
                        <DetailRow label="Departure" value={ticket.departure} />
                        <DetailRow label="Arrival" value={ticket.arrival} />
                        <DetailRow label="Seat/Transport No." value={ticket.seatDetails || ticket.transportNumber} />
                        <DetailRow label="Seller" value={ticket.sellerName} />
                        <DetailRow label="Seller Contact" value={ticket.sellerContact} />
                    </div>
                    
                    {ticket.notes && (
                         <div className="mt-4 border-t border-dark-border pt-4">
                            <p className="text-sm font-semibold text-gray-400">Additional Notes</p>
                            <p className="text-md text-gray-200 whitespace-pre-wrap">{ticket.notes}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TicketDetailModal;