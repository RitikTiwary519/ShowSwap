
export enum TicketCategory {
    Concert = 'Concert',
    Festival = 'Festival',
    Garba = 'Garba',
    Flight = 'Flight',
    Train = 'Train',
    Other = 'Other',
}

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

export interface Ticket {
    id: string;
    category: TicketCategory;
    eventName: string;
    eventDate: string; // ISO string format
    venue?: string;
    artist?: string;
    seatDetails?: string;
    departure?: string;
    arrival?: string;
    transportNumber?: string; // PNR/Flight Number
    price: number;
    sellerContact: string;
    notes?: string;
    sellerName: string;
    sellerUid: string;
    postedAt: string; // ISO string format
}
