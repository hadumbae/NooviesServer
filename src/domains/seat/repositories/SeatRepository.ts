import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type {SeatSchemaFields} from "../model/Seat.types.js";
import createSeatDuplicateError from "../utility/createSeatDuplicateError.js";

/**
 * ## SeatRepository
 *
 * Repository class for managing `Seat` entities in the database.
 * Extends the generic `BaseRepository` to provide CRUD operations
 * specifically for theatre seats, including custom handling of
 * duplicate seat entries.
 *
 * @remarks
 * - Ensures type safety with `ISeat` interface.
 * - Overrides the `throwDuplicateError` method to throw a
 *   seat-specific error when a duplicate index is detected.
 *
 * @example
 * ```ts
 * import SeatRepository from "@/pages/seat/repository/SeatRepository.ts";
 *
 * const seatRepo = new SeatRepository();
 *
 * // Create a new seat
 * await seatRepo.create({
 *   theatre: "123",
 *   screen: "A",
 *   row: "B",
 *   number: 5,
 *   layoutType: "Seat",
 *   seatType: "VIP"
 * });
 *
 * // Handles duplicate seat gracefully
 * try {
 *   await seatRepo.create({ ...duplicateSeat });
 * } catch (error) {
 *   console.error(error); // Seat-specific duplicate error
 * }
 * ```
 */
export default class SeatRepository extends BaseRepository<SeatSchemaFields> {
    /**
     * Throws a seat-specific duplicate error when a unique constraint
     * violation is detected for a seat index.
     *
     * @param indexString - The string representation of the seat index
     *                      that caused the duplicate conflict.
     * @throws {Error} Custom seat duplicate error from `createSeatDuplicateError`.
     */
    protected throwDuplicateError(indexString: string): never {
        throw createSeatDuplicateError(indexString);
    }
}
