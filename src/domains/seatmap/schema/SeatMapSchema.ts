import {z} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {RequiredBoolean} from "../../../shared/schema/booleans/RequiredBoolean.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";

export const SeatMapSchema= z.object({
    isAvailable: RequiredBoolean.optional().default(true),
    isReserved: RequiredBoolean.optional().default(false),
    price: PositiveNumberSchema,
    seat: IDInstance,
    showing: IDInstance,
});

export type ZSeatMap = z.infer<typeof SeatMapSchema>;