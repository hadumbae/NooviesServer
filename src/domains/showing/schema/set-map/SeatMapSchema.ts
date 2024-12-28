import {z, type ZodType} from "zod";
import {RequiredBoolean} from "../../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {RequiredNumber} from "../../../../shared/schema/helpers/ZodNumberHelpers.js";
import type {ISeatMap} from "../../model/ShowingInterfaces.js";
import {IDString} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import {IDInstance} from "../../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {SeatSchema} from "../../../seat/schema/SeatSchema.js";

export const SeatMapSchema: ZodType<ISeatMap> = z.object({
    _id: z.union([IDString, IDInstance]).optional(),

    isAvailable: RequiredBoolean
        .optional()
        .default(true),

    price: RequiredNumber
        .gt(0, "Must be greater than 0."),

    seat: z.union([
        IDString,
        IDInstance,
        z.lazy(() => SeatSchema),
    ]),
});