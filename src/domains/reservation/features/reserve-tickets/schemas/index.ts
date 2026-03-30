import {
    ReserveTicketInputBaseSchema, type ReserveTicketInputData,
    ReserveTicketInputSchema
} from "@domains/reservation/features/reserve-tickets/schemas/inputSchema";
import {
    type ReserveTicketPersistenceData,
    ReserveTicketPersistenceSchema
} from "@domains/reservation/features/reserve-tickets/schemas/persistenceSchema";


export {
    ReserveTicketInputBaseSchema,
    ReserveTicketInputSchema,
    ReserveTicketPersistenceSchema,
}

export type {
    ReserveTicketInputData,
    ReserveTicketPersistenceData,
}