import {StringValueSchema} from "@shared/schema/strings/StringValueSchema";
import {z} from "zod";

export const UserUniqueCodeSchema = StringValueSchema.regex(
    /^USR-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
    {message: "Invalid format. Expected USR-XXXXX-XXXXX (e.g., USR-K9P2W-LM4X1)"},
);

/**
 * TypeScript type inferred from {@link UserUniqueCodeSchema}.
 * Represents the validated string format for a user's unique system code.
 */
export type UserUniqueCode = z.infer<typeof UserUniqueCodeSchema>;