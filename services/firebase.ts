
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

import type { User, Ticket } from '../types';
// FIX: Import TicketCategory to use enum members instead of strings for type safety.
import { TicketCategory } from '../types';
import { ADMIN_UIDS } from '../constants';

// --- FIREBASE CONFIG ---
// IMPORTANT: Replace with your project's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1CQw0SZoaRGkaSV3-gvd-JTogxbJcXK0",
    authDomain: "showswap-f8db0.firebaseapp.com",
    projectId: "showswap-f8db0",
    storageBucket: "showswap-f8db0.appspot.com",
    messagingSenderId: "1021717912523",
    appId: "1:1021717912523:web:0db5ee6733cd898251b44e",
    measurementId: "G-4NBQW12FYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Optionally initialize analytics if needed (not required for auth)
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);
const authInstance = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const dbInstance = getFirestore(app);
const ticketsCol = collection(dbInstance, 'tickets');


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

// --- FIRESTORE SDK ---
export const db = {
    fetchTickets: async (includeExpired = false): Promise<Ticket[]> => {
        // Fetch tickets from Firestore, order by postedAt desc
        const q = query(ticketsCol, orderBy('postedAt', 'desc'));
        const snapshot = await getDocs(q);
        let tickets: Ticket[] = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        })) as Ticket[];
        if (!includeExpired) {
            const now = new Date();
            tickets = tickets.filter(ticket => new Date(ticket.eventDate) >= now);
        }
        return tickets;
    },

    addTicket: async (ticketData: Omit<Ticket, 'id' | 'postedAt'>): Promise<Ticket> => {
        // Remove undefined fields (Firestore does not allow undefined)
        const cleanData: any = {};
        Object.entries(ticketData).forEach(([key, value]) => {
            if (value !== undefined) cleanData[key] = value;
        });
        cleanData.postedAt = new Date().toISOString();
        const docRef = await addDoc(ticketsCol, cleanData);
        const newTicket: Ticket = {
            ...ticketData,
            id: docRef.id,
            postedAt: cleanData.postedAt
        };
        return newTicket;
    },

    deleteTicket: async (ticketId: string): Promise<void> => {
        await deleteDoc(doc(ticketsCol, ticketId));
    }
};