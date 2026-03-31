import {
    ReserveTicketInputBaseSchema, type ReserveTicketInputData,
    ReserveTicketInputSchema
} from "@domains/reservation/features/reserve-tickets/schemas/inputSchema";
import {
    type ReserveTicketPersistenceData,
    ReserveTicketPersistenceSchema
} from "@domains/reservation/features/reserve-tickets/schemas/persistenceSchema";
import {
    type ReservedShowingSnapshotInputData,
    ReservedShowingSnapshotInputSchema
} from "@domains/reservation/features/reserve-tickets/schemas/snapshotInputSchema";


export {
    ReserveTicketInputBaseSchema,
    ReserveTicketInputSchema,
    ReserveTicketPersistenceSchema,
    ReservedShowingSnapshotInputSchema,
}

export type {
    ReserveTicketInputData,
    ReserveTicketPersistenceData,
    ReservedShowingSnapshotInputData,
}