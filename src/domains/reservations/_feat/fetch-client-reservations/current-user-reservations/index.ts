import {
    fetchPaginatedUserReservations,
    type FetchPaginatedUserReservationsParams
} from "@/domains/reservations/_feat/fetch-client-reservations/current-user-reservations/fetchPaginatedUserReservations";

export * from "./query-schema";

export {
    fetchPaginatedUserReservations,
}

export type {
    FetchPaginatedUserReservationsParams,
}