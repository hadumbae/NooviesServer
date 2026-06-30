import {
    ReserveTicketInputBaseSchema, type ReserveTicketInputData,
    ReserveTicketInputSchema
} from "@/domains/reservation/_feat/reserve-tickets/schemas/inputSchema";
import {
    type ReserveTicketPersistenceData,
    ReserveTicketPersistenceSchema
} from "@/domains/reservation/_feat/reserve-tickets/schemas/persistenceSchema";
import {
    type ReservedShowingSnapshotInputData,
    ReservedShowingSnapshotInputSchema
} from "@/domains/reservation/_feat/reserve-tickets/schemas/snapshotInputSchema";


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