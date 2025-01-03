import {z, type ZodType} from "zod";

import type ISeatSubmit from "./interface/ISeatSubmit.js";

import {SeatSchemaBase} from "./SeatSchemaBase.js";
import {TheatreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";

export const SeatSubmitSchema: ZodType<ISeatSubmit> = z.object({
    ...SeatSchemaBase,
    theatre: TheatreAsyncIDString,
});