import createHttpError from "http-errors";
import type {CRUDDestroyParams, DeleteMethods} from "./CRUDDeleter.types.js";
import {CRUDBase} from "../base/CRUDBase.js";
import type {ModelObject} from "../../types/ModelObject.js";

/**
 * @file CRUDDeleter.ts
 *
 * Generic delete handler for Mongoose-backed models.
 */

/**
 * Generic CRUD delete service.
 *
 * @template TSchema - Mongoose model object shape
 */
export class CRUDDeleter<TSchema extends ModelObject>
    extends CRUDBase<TSchema>
    implements DeleteMethods
{
    /**
     * Deletes a document by ObjectId.
     *
     * @param params - Deletion parameters
     * @throws {HttpError} 404 when the document does not exist
     */
    async destroy({_id}: CRUDDestroyParams): Promise<void> {
        const doc = await this.model.findById({_id});
        if (!doc) {
            throw createHttpError(404, "Not found!");
        }

        await doc.deleteOne();
    }
}
