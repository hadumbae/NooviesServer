/**
 * @file Generic deletion service for Mongoose models.
 * @filename CRUDDeleter.ts
 */

import createHttpError from "http-errors";
import type {CRUDDestroyParams, DeleteMethods} from "./CRUDDeleter.types.js";
import {CRUDBase} from "../base/CRUDBase.js";
import {InvalidMethodError} from "../../errors/InvalidMethodError.js";
import type {BaseModel} from "../../types/schema/BaseModel.js";

/**
 * Service providing standard and soft-deletion logic for {@link BaseModel} entities.
 * * @template TSchema - The specific Mongoose model shape, extending {@link BaseModel}.
 */
export class CRUDDeleter<TSchema extends BaseModel>
    extends CRUDBase<TSchema>
    implements DeleteMethods<TSchema> {

    /**
     * Permanently removes a document from the collection via `deleteOne`.
     * * @param params - {@link CRUDDestroyParams} containing the target `_id`.
     * @throws {HttpError} 404 if the document is missing.
     */
    async destroy({_id}: CRUDDestroyParams): Promise<void> {
        const doc = await this.model.findById({_id});
        if (!doc) {
            throw createHttpError(404, "Not found!");
        }

        await doc.deleteOne();
    }

    /**
     * Executes a soft-delete via the model's instance method.
     * * @param params - {@link CRUDDestroyParams} containing the target `_id`.
     * @returns The updated document with {@link ModelSoftDelete} flags applied.
     * @throws {HttpError} 404 if the document is missing.
     * @throws {InvalidMethodError} If the hydrated document lacks a `softDelete` function.
     */
    async softDelete({_id}: CRUDDestroyParams): Promise<TSchema> {
        const doc = await this.model.findById({_id});

        if (!doc) {
            throw createHttpError(404, "Not found!");
        }

        // Validate that the model actually implements the softDelete method
        if (typeof (doc as any).softDelete === "function") {
            return (doc as any).softDelete();
        }

        throw new InvalidMethodError({
            message: `Model '${this.model.name}' cannot soft delete.`,
            modelName: this.model.name,
            methodName: "softDelete",
        });
    }
}