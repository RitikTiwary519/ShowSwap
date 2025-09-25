
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
import type { Ticket } from '../types';
import Spinner from '../components/Spinner';

const AdminPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllTickets = useCallback(async () => {
        setLoading(true);
        try {
            const allTickets = await db.fetchTickets(true);
            setTickets(allTickets);
        } catch (err) {
            setError('Failed to fetch tickets.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllTickets();
    }, [fetchAllTickets]);

    const handleDelete = async (ticketId: string) => {
        if (window.confirm('Are you sure you want to delete this ticket permanently?')) {
            try {
                await db.deleteTicket(ticketId);
                // Refetch all tickets from the source of truth to ensure UI consistency.
                await fetchAllTickets();
            } catch (err) {
                alert('Failed to delete ticket.');
                console.error(err);
            }
        }
    };
    
    const isExpired = (eventDate: string) => new Date(eventDate) < new Date();

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            {loading && <Spinner />}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && (
                <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-dark-border">
                            <thead className="bg-dark-border/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seller</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {tickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-dark-border/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{ticket.eventName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.sellerName} ({ticket.sellerContact})</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${ticket.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {isExpired(ticket.eventDate) ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500 text-gray-100">Expired</span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-600 text-green-100">Active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleDelete(ticket.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
