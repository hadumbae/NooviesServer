import BaseCRUDController from "../../../shared/controller/base-crud-controller/BaseCRUDController.js";
import type {PersonSchemaFields} from "../model/Person.types";
import type {Request, Response} from "express";
import type PersonImageService from "../services/image-service/PersonImageService.js";
import isValidObjectId from "../../../shared/utility/mongoose/isValidObjectId.js";
import type {
    BaseControllerCRUDMethods,
    BaseCRUDControllerConstructorParams
} from "@shared/controller/base-crud-controller/BaseControllerCRUDMethods";

interface IPersonControllerConstructor extends BaseCRUDControllerConstructorParams<PersonSchemaFields> {

    /** Service for managing profile images. */
    imageService: PersonImageService;
}

/**
 * Interface defining additional methods for {@link PersonController}.
 *
 * Extends {@link BaseControllerCRUDMethods} with endpoints for profile image management:
 * - Updating profile images
 * - Deleting profile images
 */
export interface IPersonController extends BaseControllerCRUDMethods {
    /**
     * Updates a person's profile image.
     *
     * @param req - Express request (expects `params._id` and `file`)
     * @param res - Express response
     */
    updateProfileImage(req: Request, res: Response): Promise<Response>;

    /**
     * Deletes a person's profile image.
     *
     * @param req - Express request (expects `params._id`)
     * @param res - Express response
     */
    deleteProfileImage(req: Request, res: Response): Promise<Response>;
}

/**
 * Controller responsible for handling {@link PersonSchemaFields} CRUD operations
 * and profile image management.
 *
 * Extends {@link BaseCRUDController} to provide standard CRUD functionality,
 * and adds endpoints for:
 * - Updating a person's profile image
 * - Deleting a person's profile image
 *
 * @example
 * // Update profile image:
 * // POST /people/:id/profile-image (multipart/form-data with file)
 *
 * // Delete profile image:
 * // DELETE /people/:id/profile-image
 */
export default class PersonController extends BaseCRUDController<PersonSchemaFields> implements IPersonController {
    /** Service for managing profile images. */
    protected imageService: PersonImageService;

    /**
     * Creates a new {@link PersonController}.
     *
     * @param params - Constructor parameters including services and base CRUD options
     */
    constructor(params: IPersonControllerConstructor) {
        const {imageService, ...superParams} = params;
        super(superParams);

        this.imageService = imageService;
    }

    /**
     * Updates the profile image of a specific person.
     *
     * @param req - Express request (expects `params._id` and `file`)
     * @param res - Express response
     * @returns The updated person document
     *
     * @example
     * // POST /people/123/profile-image with multipart file
     * // Response: { _id: "123", firstName: "John", profileImage: "..." }
     */
    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const {populate, virtuals} = this.queryUtils.fetchOptionsFromQuery(req);

        const personId = isValidObjectId(_id);
        const profileImage = req.file as Express.Multer.File;

        await this.imageService.updateProfileImage({personId, image: profileImage});
        const person = await this.repository.findById({_id: personId, options: {populate, virtuals}});

        return res.status(200).json(person);
    }

    /**
     * Deletes the profile image of a specific person.
     *
     * @param req - Express request (expects `params._id`)
     * @param res - Express response
     * @returns JSON response indicating success
     *
     * @example
     * // DELETE /people/123/profile-image
     * // Response: { message: "Image Removed." }
     */
    async deleteProfileImage(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        const personId = isValidObjectId(_id);

        await this.imageService.deleteProfileImage({personId});
        return res.status(200).json({message: "Image Removed."});
    }
}
