/**
 * @fileoverview Express controllers for managing Person profile image lifecycle.
 * Routes requests for image updates and removals to the service layer.
 */

import type {Request, Response} from "express";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";
import {deleteProfileImage, updateProfileImage} from "@domains/person/_feat/update-image/service";

/**
 * Patches a person's profile image.
 * Expects a multipart/form-data request with an 'image' file.
 */
export async function patchUpdateProfileImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.params;
    const personID = isValidObjectId(_id);
    const profileImage = req.file as Express.Multer.File;

    await updateProfileImage({_id: personID, image: profileImage});

    return res.status(200).json({message: "Image updated."});
}

/**
 * Deletes a person's profile image and cleans up the remote asset.
 */
export async function deleteRemoveProfileImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.params;
    const personID = isValidObjectId(_id);

    await deleteProfileImage({_id: personID});

    return res.status(200).json({message: "Image removed."});
}