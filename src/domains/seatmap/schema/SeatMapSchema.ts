import {z} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {BooleanValueSchema} from "../../../shared/schema/booleans/BooleanValueSchema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";

export const SeatMapSchema= z.object({
    isAvailable: BooleanValueSchema.optional().default(true),
    isReserved: BooleanValueSchema.optional().default(false),
    price: PositiveNumberSchema,
    seat: IDInstance,
    showing: IDInstance,
});

export type ZSeatMap = z.infer<typeof SeatMapSchema>;