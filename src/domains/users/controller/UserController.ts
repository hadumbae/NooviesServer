import type { Request, Response } from "express";
import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type UserSchemaFields from "@models/UserSchemaFields.js";
import type UserService from "../service/user-service/UserService.js";
import createHttpError from "http-errors";
import type { UserControllerConstructor, UserControllerMethods } from "./UserController.types.js";
import type { UserPasswordUpdateInput } from "../schema/UserPasswordUpdateInputSchema.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";

/**
 * Controller for managing user-related operations.
 *
 * Extends the `BaseCRUDController` with user-specific functionality.
 * Includes CRUD operations plus the ability to update a user's password.
 *
 * @example
 * ```ts
 * const userController = new UserController({ service: userService, model: User });
 *
 * // Update password for a user
 * await userController.updateUserPassword(req, res);
 * ```
 */
export default class UserController extends BaseCRUDController<UserSchemaFields> implements UserControllerMethods {
    /** Instance of the user service used for business logic. */
    service: UserService;

    /**
     * Creates a new UserController instance.
     *
     * @param params - Constructor parameters including the user service and base controller parameters.
     */
    constructor(params: UserControllerConstructor) {
        const { service, ...superParams } = params;
        super(superParams);

        this.service = service;
    }

    /**
     * Updates the password for a specific user.
     *
     * Validates authentication, ensures the user ID is valid, and
     * delegates the update operation to the `UserService`.
     *
     * @param req - Express request object containing `authUserID`, `params._id`, and validated password data.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response with a success message.
     *
     * @throws HttpError 401 if the authenticated user is not provided.
     */
    async updateUserPassword(req: Request, res: Response): Promise<Response> {
        const { authUserID } = req;

        if (!authUserID) {
            throw createHttpError(401, "Unauthorized!");
        }

        const { _id } = req.params;
        const userID = isValidObjectId(_id);

        const data = req.validatedBody as UserPasswordUpdateInput;

        await this.service.updateUserPassword({
            userID,
            authUserID,
            data,
        });

        return res
            .status(200)
            .json({ message: "User Password Updated Successfully." });
    }
}
