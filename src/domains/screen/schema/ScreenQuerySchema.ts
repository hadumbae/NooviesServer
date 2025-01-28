import {z} from "zod";
import {Types} from "mongoose";
import createHttpError from "http-errors";

export const ScreenQuerySchema = z.object({
    theatre: z
        .string()
        .optional()
        .transform((theatre) => {
            if (!theatre) return theatre;

            try {
                const parsed = JSON.parse(theatre)
                if (typeof parsed === "string" && Types.ObjectId.isValid(parsed)) return parsed;
            } catch (e) {}

           throw createHttpError(400, "Invalid Theatre ID");
        }),
});