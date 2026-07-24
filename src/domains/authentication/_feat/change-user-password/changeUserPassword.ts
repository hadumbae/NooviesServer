/**
 * @fileoverview Service for updating a user's password in the database.
 */

import {Types} from "mongoose";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {User} from "@/domains/users/model/user";
import type {
    UserPasswordUpdateInput
} from "@/domains/authentication/_feat/change-user-password/UserPasswordUpdateInputSchema";

/** Data required to update a user password. */
export type PasswordUpdateData = {
    authUserID: Types.ObjectId;
    userID: Types.ObjectId;
    data: UserPasswordUpdateInput;
};

/** Validates the session and updates the user's password with a new hash. */
export async function updateUserPassword(params: PasswordUpdateData) {
    const {authUserID, userID, data} = params;

    // --- UNAUTHORISED ---

    if (!authUserID || !userID || authUserID !== userID) {
        throw createHttpError(401, "Unauthorized.");
    }

    // --- GET USER ---

    const user = await User.findById(userID);

    if (!user) {
        throw createHttpError(404, "User Not Found.");
    }

    // --- UPDATE PASSWORD ---

    const hashedPassword = await bcrypt.hash(data.password, 12);

    if (!hashedPassword) {
        throw createHttpError(500, "Something went wrong. Please try again.");
    }

    user.password = hashedPassword;
    await user.save();
}