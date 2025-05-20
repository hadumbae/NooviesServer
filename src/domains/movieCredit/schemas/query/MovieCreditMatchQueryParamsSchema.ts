import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {ObjectIdStringSchema, RequiredStringSchema} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import {RoleTypeEnumSchema} from "../enums/RoleTypeEnumSchema.js";
import {PositiveNumber} from "../../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ParamBoolean} from "../../../../shared/schema/helpers/ZodBooleanHelpers.js";

export const MovieCreditMatchQueryParamsSchema = z.object({
    // Base

    movie: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(ObjectIdStringSchema)),

    person: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(ObjectIdStringSchema)),

    roleType: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(RoleTypeEnumSchema)),

    // Crew

    job: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(RequiredStringSchema)),

    // Cast

    characterName: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(RequiredStringSchema)),

    billingOrder: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(PositiveNumber)),

    // Flags

    uncredited: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(ParamBoolean)),

    voiceOnly: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(ParamBoolean)),

    cameo: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(ParamBoolean)),

    motionCapture: z
        .string({invalid_type_error: "Must be a valid URL string."})
        .optional()
        .transform(transformZodParsedJSON(ParamBoolean)),
});

export type MovieCreditMatchQueryParams = z.infer<typeof MovieCreditMatchQueryParamsSchema>;