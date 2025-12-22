import { Types } from "mongoose";
import type { UserPasswordUpdateInput } from "../../schema/UserPasswordUpdateInputSchema.js";

/**
 * Data required to update a user's password.
 *
 * Includes the authenticated user's ID, the target user's ID, and
 * the new password information.
 */
export type PasswordUpdateData = {
    /** ID of the authenticated user making the request. */
    authUserID: Types.ObjectId;

    /** ID of the user whose password is being updated. */
    userID: Types.ObjectId;

    /** The new password data including confirmation. */
    data: UserPasswordUpdateInput;
};

/**
 * Interface defining the methods available in the user service.
 *
 * Currently includes methods for updating a user's password.
 */
export interface UserServiceMethods {
    /**
     * Updates the password for a user.
     *
     * @param params - Object containing `authUserID`, `userID`, and new password `data`.
     * @throws HttpError 401 if the authenticated user does not match the target user.
     * @throws HttpError 404 if the user is not found.
     * @throws HttpError 500 if password hashing fails.
     */
    updateUserPassword(params: PasswordUpdateData): void;
}
