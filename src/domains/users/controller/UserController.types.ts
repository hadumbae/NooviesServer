import type {
    BaseControllerCRUDMethods,
    IBaseCRUDControllerConstructor
} from "../../../shared/controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type {UserSchemaFields} from "@models/User.types.js";
import type UserService from "../service/user-service/UserService.js";
import type { Request, Response } from "express";

/**
 * Constructor parameters required to create a UserController.
 *
 * Extends the base CRUD controller constructor and includes a reference
 * to the user service.
 */
export interface UserControllerConstructor extends IBaseCRUDControllerConstructor<UserSchemaFields> {
    /** Instance of the user service used by the controller. */
    service: UserService;
}

/**
 * Interface defining the methods available in the UserController.
 *
 * Extends the base CRUD controller methods and adds user-specific operations
 * such as updating a user's password.
 */
export interface UserControllerMethods extends BaseControllerCRUDMethods<UserSchemaFields> {
    /**
     * Updates the password for a user.
     *
     * @param req - Express request object, containing validated password data.
     * @param res - Express response object.
     * @returns A promise resolving to the Express response.
     */
    updateUserPassword(req: Request, res: Response): Promise<Response>;
}
