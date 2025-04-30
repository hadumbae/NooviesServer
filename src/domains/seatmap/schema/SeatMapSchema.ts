import {z, type ZodType} from "zod";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ObjectIdStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type ISeatMap from "../model/ISeatMap.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";

export const SeatMapSchema: ZodType<ISeatMap> = z.object({
    _id: z.union([ObjectIdStringSchema, IDInstance]),

    isAvailable: RequiredBoolean
        .optional()
        .default(true),

    isReserved: RequiredBoolean
        .optional()
        .default(false),

    price: RequiredNumber
        .gt(0, "Must be greater than 0."),

    seat: z
        .union([IDInstance, z.lazy(() => SeatSchema)]),

    showing: z
        .union([IDInstance, z.lazy(() => ShowingSchema)]),
});

export type ZSeatMap = z.infer<typeof SeatMapSchema>;