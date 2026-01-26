import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";

/**
 * @constant SeatMapPopulateRefs
 * @description
 * Default population paths for the `SeatMap` Mongoose model.
 *
 * Provides a reusable, type-safe set of references for `.populate()`
 * calls across repositories, services, and controllers.
 *
 * Ensures consistency and prevents hard-coded string paths, while
 * keeping population logic synchronized with the schema.
 *
 * @remarks
 * - Uses `as const` to preserve literal string types and readonly tuple inference.
 * - Populates:
 *   - `showing`
 *   - `seat` with nested population of `screen` and `theatre`
 *
 * @example
 * ```ts
 * SeatMapModel.find()
 *   .populate(SeatMapPopulateRefs)
 *   .exec();
 * ```
 *
 * @see SeatMapSchemaFields – Interface for the underlying model fields.
 */
const SeatMapPopulateRefs: PopulatePath[] = [
    {
        path: "showing",
        populate: [
            {path: "movie", populate: [{path: "genres"}]},
            {path: "screen"},
            {path: "theatre"},
            {path: "seatMapCount"},
            {path: "unavailableSeatsCount"},
            {path: "availableSeatsCount"},
            {path: "reservedSeatsCount"},
            {path: "soldSeatsCount"},
        ],
    },
    {
        path: "seat",
        populate: [
            {path: "screen"},
            {path: "theatre"},
        ],
    },
] as const;

export default SeatMapPopulateRefs;
