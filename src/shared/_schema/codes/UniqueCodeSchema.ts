import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";
import {z} from "zod";

export const UniqueCodeSchema = StringValueSchema.regex(
    /^[A-Z]{3}-[A-Z0-9]{5}-[A-Z0-9]{5}$/,
    {message: "Invalid format. Expected XXX-XXXXX-XXXXX (e.g., USR-K9P2W-LM4X1)"},
);

export type UniqueCode = z.infer<typeof UniqueCodeSchema>;