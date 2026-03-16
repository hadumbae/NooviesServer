/**
 * @file ShowingConfig.schema.ts
 *
 * Mongoose schema for showing-level configuration flags.
 */

import {Schema} from "mongoose";
import type {ShowingConfigSchemaFields} from "./ShowingConfig.types.js";

/**
 * Showing configuration schema.
 *
 * Stores feature toggles that control runtime behaviour
 * for individual showings.
 */
export const ShowingConfigSchema = new Schema<ShowingConfigSchemaFields>({
    /**
     * Whether seat reservations are allowed for the showing.
     *
     * Defaults to `false`.
     */
    canReserveSeats: {
        type: Boolean,
        default: false,
    },
});
