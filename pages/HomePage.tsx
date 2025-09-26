import React, { useState, useEffect } from 'react';
import type { Ticket } from '../types';
import { db } from '../services/firebase';
import TicketCard from '../components/TicketCard';
import Spinner from '../components/Spinner';
import TicketDetailModal from '../components/TicketDetailModal';
import MyTicketCorner from '../components/MyTicketCorner';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setLoading(true);
                const fetchedTickets = await db.fetchTickets();
                setTickets(fetchedTickets);
            } catch (err) {
                setError('Failed to load tickets. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    const handleCardClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseModal = () => {
        setSelectedTicket(null);
    };

    // Real-time search filter (exclude notes, sellerName, sellerContact)
    const filteredTickets = tickets.filter(ticket => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return [
            ticket.eventName,
            ticket.eventDate,
            ticket.artist,
            ticket.venue,
            ticket.category,
            ticket.seatDetails,
            ticket.departure,
            ticket.arrival,
            ticket.transportNumber,
            ticket.price?.toString(),
            ticket.postedAt
        ].some(field => field && field.toString().toLowerCase().includes(q));
    });

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                 <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
                    Find Your Next Experience
                </h1>
                <p className="text-center text-gray-400 mb-8 md:mb-12">Browse and exchange tickets for events worldwide.</p>
            </motion.div>

            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by event, date, artist, venue, etc."
                    className="w-full max-w-md px-4 py-2 rounded bg-dark-card border border-dark-border text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
            </div>

            {/* My Ticket Corner for logged-in users */}
            <MyTicketCorner />

            {loading && <Spinner />}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && filteredTickets.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No tickets found. Try a different search.</p>
            )}

            {!loading && !error && filteredTickets.length > 0 && (
                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredTickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} onClick={() => handleCardClick(ticket)} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            <AnimatePresence>
                {selectedTicket && (
                    <TicketDetailModal ticket={selectedTicket} onClose={handleCloseModal} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomePage;