import {z} from "zod";
import User from "../../users/model/User.js";

export const UserRegisterSchema = z.object({
    name: z
        .string({required_error: "Name is required.", invalid_type_error: "Name must be a string."})
        .min(3, "Name must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    email: z
        .string({required_error: "Email is required.", invalid_type_error: "Email must be a string."})
        .email({message: "Invalid email address."})
        .max(255, "Email must not be more than 255 characters."),

    password: z
        .string({required_error: "Password is required.", invalid_type_error: "Password must be a string."})
        .min(16, "Password must be at least 16 characters.")
        .max(255, "Password must not be more than 255 characters."),

    confirm: z
        .string({required_error: "Confirm is required.", invalid_type_error: "Confirm must be a string."})
        .min(16, "Confirm must be at least 16 characters.")
        .max(255, "Confirm must not be more than 255 characters."),
}).superRefine(async (user, ctx) => {
    if (user.password !== user.confirm) {
        ctx.addIssue({code: z.ZodIssueCode.custom, message: "Passwords do not match", path: ['password']});
        ctx.addIssue({code: z.ZodIssueCode.custom, message: "Passwords do not match", path: ['confirm']});
    }

    const checkUser = await User.findOne({email: user.email});
    if (checkUser) ctx.addIssue({code: z.ZodIssueCode.custom, message: "Email already taken.", path: ['email']});
});

export type UserRegisterData = z.infer<typeof UserRegisterSchema>;