import type {Response} from "express";
import {BookingError} from "../../../errors/reservations/BookingError.js";

/**
 * Type guard for {@link BookingError}.
 *
 * @param error - Unknown error value.
 * @returns `true` if the error is a {@link BookingError}.
 */
export const isBookingError = (error: unknown): error is BookingError => {
    return error instanceof BookingError;
};

/**
 * Sends an HTTP response for a {@link BookingError}.
 *
 * @remarks
 * Extracts the serialized error payload and maps it directly
 * to an Express JSON response.
 *
 * Intended to be called from a global error handler.
 *
 * @param error - Unknown error value.
 * @param res - Express response object.
 */
export const handleBookingError = (error: unknown, res: Response): void => {
    if (error instanceof BookingError) {
        const {message, errorCode, statusCode} = error;
        res.status(statusCode).json({message, errorCode, statusCode});
    }
};
