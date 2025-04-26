import {z, type ZodType} from "zod";
import type IUserPasswordUpdateSubmit from "../interface/IUserPasswordUpdateSubmit.js";

export const UserPasswordUpdateSubmitSchema: ZodType<IUserPasswordUpdateSubmit> = z.object({
    password: z
        .string({required_error: "Password is required.", invalid_type_error: "Password must be a string."})
        .min(16, "Password must be at least 16 characters.")
        .max(255, "Password must not be more than 255 characters."),

    confirm: z
        .string({required_error: "Confirm is required.", invalid_type_error: "Confirm must be a string."})
        .min(16, "Confirm must be at least 16 characters.")
        .max(255, "Confirm must not be more than 255 characters."),
}).refine(
    (data) => data.password === data.confirm,
    {message: "Passwords do not match", path: ['confirm']},
);

export type UserPasswordUpdateSubmit = z.infer<typeof UserPasswordUpdateSubmitSchema>;