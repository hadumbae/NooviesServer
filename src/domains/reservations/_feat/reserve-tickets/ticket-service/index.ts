import {reserveTickets} from "src/domains/reservations/_feat/reserve-tickets/ticket-service/service";
import {
    reserveReservationSeats
} from "src/domains/reservations/_feat/reserve-tickets/ticket-service/reserveReservationSeats";
import {
    saveValidatedReservation
} from "src/domains/reservations/_feat/reserve-tickets/ticket-service/saveValidatedReservation";
import type {
    ReserveGeneralTicketData,
    ReserveSeatTicketData,
    ReserveTicketsParams
} from "src/domains/reservations/_feat/reserve-tickets/ticket-service/service.types";

export {
    reserveTickets,
    saveValidatedReservation,
    reserveReservationSeats,
}

export type {
    ReserveTicketsParams,
    ReserveGeneralTicketData,
    ReserveSeatTicketData,
}