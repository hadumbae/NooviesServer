import {z} from "zod";
import User from "../../users/model/User.js";

export const UserLoginSchema = z.object({
    email: z
        .string({required_error: "Email is required.", invalid_type_error: "Email must be a string."})
        .email({message: "Invalid email address."})
        .max(255, "Email must not be more than 255 characters.")
        .refine(
            async (email) => {
                const user = await User.findOne({ email });
                return !!user;
            },
            {message: "No User Found With Email."},
        ),

    password: z
        .string({required_error: "Password is required.", invalid_type_error: "Password must be a string."})
        .min(16, "Password must be at least 16 characters.")
        .max(255, "Password must not be more than 255 characters."),
});

export type UserLoginData = z.infer<typeof UserLoginSchema>;