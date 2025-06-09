import {z} from "zod";
import {RoleTypeEnumSchema} from "../enums/RoleTypeEnumSchema.js";
import {RequiredStringSchema} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedBooleanSchema} from "../../../../shared/schema/boolean/CoercedBooleanSchema.js";
import {CoercedNumberSchema} from "../../../../shared/schema/numbers/CoercedNumberSchema.js";

/**
 * Base schema for both cast and crew movie credits.
 *
 * This schema includes shared fields that may apply to either credit type (`CAST` or `CREW`),
 * but does not enforce which fields are required—this is handled in role-specific schemas.
 *
 * ### Fields:
 * - `roleType`: Discriminator field indicating `"CAST"` or `"CREW"`.
 * - `notes` (optional): Additional comments or context about the credit.
 *
 * #### Cast-related optional fields:
 * - `characterName`: Name of the character portrayed (optional).
 * - `billingOrder`: Order of appearance/prominence (must be ≥ 1, if present).
 *
 * #### Crew-related optional fields:
 * - `job`: The crew member’s role (e.g. "Director", "Editor").
 *
 * #### Shared optional flags:
 * - `uncredited`: Whether the person appears uncredited.
 * - `voiceOnly`: Indicates a voice-only performance.
 * - `cameo`: Indicates a cameo appearance.
 * - `motionCapture`: Indicates motion capture work.
 *
 * This base schema is intended for composition in more specific schemas
 * where the `roleType` determines which fields are required.
 */
export const MovieCreditBaseSchema = z.object({
    roleType: RoleTypeEnumSchema,
    notes: RequiredStringSchema.nullable().optional(),

    job: RequiredStringSchema.optional(),

    characterName: RequiredStringSchema.optional(),
    billingOrder: CoercedNumberSchema.min(1, "Billing Order must be at least 1.").optional(),

    uncredited: CoercedBooleanSchema.optional(),
    voiceOnly: CoercedBooleanSchema.optional(),
    cameo: CoercedBooleanSchema.optional(),
    motionCapture: CoercedBooleanSchema.optional(),
});