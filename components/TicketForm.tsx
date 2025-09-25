
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import type { Ticket } from '../types';
import { TicketCategory } from '../types';
import { TICKET_CATEGORIES } from '../constants';
import Spinner from './Spinner';

interface TicketFormProps {
    onSuccess: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSuccess }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState<Partial<Omit<Ticket, 'id' | 'postedAt'>>>({
        category: TicketCategory.Concert,
        price: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                sellerContact: currentUser.email || '',
                sellerName: currentUser.displayName || 'Anonymous',
                sellerUid: currentUser.uid,
            }));
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (parseFloat(value) || 0) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!currentUser || !formData.eventName || !formData.eventDate || !formData.price) {
            setError('Please fill all required fields.');
            return;
        }
        
        setLoading(true);
        try {
            const ticketData: Omit<Ticket, 'id' | 'postedAt'> = {
                category: formData.category!,
                eventName: formData.eventName,
                eventDate: new Date(formData.eventDate).toISOString(),
                price: formData.price,
                sellerContact: formData.sellerContact!,
                sellerName: formData.sellerName!,
                sellerUid: formData.sellerUid!,
                venue: formData.venue,
                artist: formData.artist,
                seatDetails: formData.seatDetails,
                departure: formData.departure,
                arrival: formData.arrival,
                transportNumber: formData.transportNumber,
                notes: formData.notes,
            };
            await db.addTicket(ticketData);
            onSuccess();
        } catch (err) {
            setError('Failed to post ticket. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const category = formData.category;
    const isEventCategory = category && [TicketCategory.Concert, TicketCategory.Festival, TicketCategory.Garba].includes(category);
    const isTransportCategory = category && [TicketCategory.Flight, TicketCategory.Train].includes(category);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple">
                    {TICKET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Event Name / Title *</label>
                <input type="text" name="eventName" onChange={handleChange} required className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Event Date *</label>
                <input type="datetime-local" name="eventDate" onChange={handleChange} required className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
            </div>
            
            {isEventCategory && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Venue</label>
                        <input type="text" name="venue" onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Artist / Performer</label>
                        <input type="text" name="artist" onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Seat Details</label>
                        <input type="text" name="seatDetails" onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
                    </div>
                </>
            )}

            {isTransportCategory && (
                 <>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Departure</label>
                        <input type="text" name="departure" onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Arrival</label>
                        <input type="text" name="arrival" onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Seat / PNR / Flight Number</label>
                        <input type="text" name="transportNumber" onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-300">Price ($) *</label>
                <input type="number" name="price" min="0" step="0.01" onChange={handleChange} value={formData.price || ''} required className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Your Contact Info *</label>
                <input type="text" name="sellerContact" value={formData.sellerContact || ''} onChange={handleChange} required className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Additional Notes</label>
                <textarea name="notes" rows={3} onChange={handleChange} className="mt-1 block w-full bg-dark-bg border border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-brand-purple disabled:opacity-50">
                {loading ? <Spinner /> : 'Post Ticket'}
            </button>
        </form>
    );
};

export default TicketForm;
