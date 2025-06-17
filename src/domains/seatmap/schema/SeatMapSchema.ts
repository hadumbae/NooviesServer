import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type ISeatMap from "../model/ISeatMap.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";
import {ObjectIdStringSchema} from "../../../shared/schema/strings/ObjectIdStringSchema.js";
import {RequiredBoolean} from "../../../shared/schema/booleans/RequiredBoolean.js";

export const SeatMapSchema: ZodType<ISeatMap> = z.object({
    _id: z.union([ObjectIdStringSchema, IDInstance]),

    isAvailable: RequiredBoolean
        .optional()
        .default(true),

    isReserved: RequiredBoolean
        .optional()
        .default(false),

    price: CoercedNumberSchema
        .gt(0, "Must be greater than 0."),

    seat: z
        .union([IDInstance, z.lazy(() => SeatSchema)]),

    showing: z
        .union([IDInstance, z.lazy(() => ShowingSchema)]),
});

export type ZSeatMap = z.infer<typeof SeatMapSchema>;