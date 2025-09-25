
import { TicketCategory } from './types';

export const TICKET_CATEGORIES: TicketCategory[] = [
    TicketCategory.Concert,
    TicketCategory.Festival,
    TicketCategory.Garba,
    TicketCategory.Flight,
    TicketCategory.Train,
    TicketCategory.Other,
];

// In a real application, this should be managed in a secure backend/database.
export const ADMIN_UIDS: string[] = ['admin_user_special_uid'];
