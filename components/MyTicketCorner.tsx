import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import type { Ticket } from '../types';
import Spinner from './Spinner';

const MyTicketCorner: React.FC = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTickets = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const allTickets = await db.fetchTickets(true);
      setTickets(allTickets.filter(t => t.sellerUid === currentUser.uid));
    } catch (err) {
      setError('Failed to fetch your tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
    // eslint-disable-next-line
  }, [currentUser]);

  const handleDelete = async (ticketId: string) => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await db.deleteTicket(ticketId);
      fetchMyTickets();
    } catch {
      alert('Failed to delete ticket.');
    }
  };

  if (!currentUser) return null;

  return (
    <section className="my-8 bg-dark-card rounded-lg border border-dark-border p-6">
      <h2 className="text-xl font-bold mb-4">My Ticket Corner</h2>
      {loading && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && tickets.length === 0 && <p className="text-gray-400">You have not posted any tickets yet.</p>}
      <ul className="space-y-4">
        {tickets.map(ticket => (
          <li key={ticket.id} className="flex items-center justify-between bg-dark-border rounded p-4">
            <div>
              <div className="font-semibold text-lg">{ticket.eventName}</div>
              <div className="text-sm text-gray-400">{ticket.eventDate && new Date(ticket.eventDate).toLocaleString()}</div>
            </div>
            <button
              onClick={() => handleDelete(ticket.id)}
              className="ml-4 px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MyTicketCorner;
