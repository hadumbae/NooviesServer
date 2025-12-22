import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import User from "@models/User.js";
import type { PasswordUpdateData, UserServiceMethods } from "./UserService.types.js";

/**
 * Service class for user-related operations.
 *
 * Implements `UserServiceMethods` and provides functionality such as
 * updating a user's password.
 *
 * @example
 * ```ts
 * const userService = new UserService();
 *
 * await userService.updateUserPassword({
 *   authUserID: "64b0f1f1e3b8c3d1f4a2a2b3",
 *   userID: "64b0f1f1e3b8c3d1f4a2a2b3",
 *   data: { password: "newSecurePassword123" }
 * });
 * ```
 */
export default class UserService implements UserServiceMethods {
    /**
     * Updates the password of a user.
     *
     * @param params - Object containing:
     *   - `authUserID`: ID of the authenticated user making the request.
     *   - `userID`: ID of the user whose password is being updated.
     *   - `data`: Object containing the new password.
     *
     * @throws HttpError 401 if the authenticated user does not match the target user.
     * @throws HttpError 404 if the user is not found.
     * @throws HttpError 500 if hashing the password fails.
     */
    async updateUserPassword(params: PasswordUpdateData) {
        const { authUserID, userID, data } = params;

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
}
