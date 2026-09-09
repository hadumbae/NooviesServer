/**
 * @fileoverview Handles the logic for registering a new user in the system.
 */

import bcrypt from "bcryptjs";
import {User, type UserSchemaFields} from "@/domains/users/model/user";
import {checkIfEmailExists} from "@/domains/authentication/_feat/register-user/checkIfEmailExists";
import type {UserRegisterInput} from "@/domains/authentication/_feat/register-user/UserRegisterInputSchema";

/** Configuration object containing the user registration data. */
type RegisterConfig = {
    data: UserRegisterInput;
}

/**
 * Validates the email uniqueness, hashes the password, and persists a new user record.
 */
export async function registerUser(
    {data: {name, email, password}}: RegisterConfig
): Promise<UserSchemaFields> {
    await checkIfEmailExists(email);
    const hashedPassword = await bcrypt.hash(password, 12);

    return User.create({
        name,
        email,
        password: hashedPassword,
    });
}