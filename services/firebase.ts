import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut as firebaseSignOut 
} from 'firebase/auth';

import type { User, Ticket } from '../types';
// FIX: Import TicketCategory to use enum members instead of strings for type safety.
import { TicketCategory } from '../types';
import { ADMIN_UIDS } from '../constants';

// --- FIREBASE CONFIG ---
// IMPORTANT: Replace with your project's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app);
const googleProvider = new GoogleAuthProvider();


// MOCK DATABASE in localStorage
const MOCK_TICKETS_KEY = 'showswap_mock_tickets';

const getMockTickets = (): Ticket[] => {
    try {
        const tickets = localStorage.getItem(MOCK_TICKETS_KEY);
        return tickets ? JSON.parse(tickets) : [];
    } catch (error) {
        return [];
    }
};

const setMockTickets = (tickets: Ticket[]) => {
    localStorage.setItem(MOCK_TICKETS_KEY, JSON.stringify(tickets));
};


// Initialize with some dummy data if empty
if (getMockTickets().length === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const initialTickets: Ticket[] = [
        {
            // FIX: Use TicketCategory enum member instead of a string literal to match the 'Ticket' type.
            id: '1', category: TicketCategory.Concert, eventName: 'Cosmic Grooves Tour', eventDate: nextWeek.toISOString(),
            venue: 'Starlight Amphitheater', artist: 'The Celestial Band', seatDetails: 'Section A, Row 5, Seat 12',
            price: 75, sellerContact: 'seller1@example.com', sellerName: 'Alex Ray', sellerUid: 'user1_uid', postedAt: new Date().toISOString()
        },
        {
            // FIX: Use TicketCategory enum member instead of a string literal to match the 'Ticket' type.
            id: '2', category: TicketCategory.Flight, eventName: 'Flight to Neo-Tokyo', eventDate: tomorrow.toISOString(),
            departure: 'SFO', arrival: 'HND', transportNumber: 'NH107',
            price: 850, sellerContact: 'seller2@example.com', sellerName: 'Mia Wallace', sellerUid: 'user2_uid', postedAt: new Date().toISOString()
        },
    ];
    setMockTickets(initialTickets);
}


// --- REAL FIREBASE AUTH SDK WRAPPERS ---

export const auth = {
    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(authInstance, (firebaseUser) => {
            if (firebaseUser) {
                const user: User = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                };
                callback(user);
            } else {
                callback(null);
            }
        });
    },
};

export const signInWithGoogle = async (): Promise<{ user: User }> => {
    const result = await signInWithPopup(authInstance, googleProvider);
    const firebaseUser = result.user;
    const user: User = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
    };
    return { user };
};

export const signOut = async (): Promise<void> => {
    await firebaseSignOut(authInstance);
};

// --- MOCK FIRESTORE SDK ---
// (Database operations remain mocked as per instructions)
export const db = {
    fetchTickets: async (includeExpired = false): Promise<Ticket[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const allTickets = getMockTickets();
                if (includeExpired) {
                    resolve(allTickets.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()));
                } else {
                    const now = new Date();
                    const activeTickets = allTickets.filter(ticket => new Date(ticket.eventDate) >= now);
                    resolve(activeTickets.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()));
                }
            }, 800);
        });
    },

    addTicket: async (ticketData: Omit<Ticket, 'id' | 'postedAt'>): Promise<Ticket> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const allTickets = getMockTickets();
                const newTicket: Ticket = {
                    ...ticketData,
                    id: `mock_${Date.now()}`,
                    postedAt: new Date().toISOString()
                };
                const updatedTickets = [...allTickets, newTicket];
                setMockTickets(updatedTickets);
                resolve(newTicket);
            }, 500);
        });
    },

    deleteTicket: async (ticketId: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const allTickets = getMockTickets();
                const updatedTickets = allTickets.filter(t => t.id !== ticketId);
                setMockTickets(updatedTickets);
                resolve();
            }, 500);
        });
    }
};