/**
 * @file PersistenceManager.ts
 *
 * Shared error-normalization utilities for persistence and retrieval
 * operations against Mongoose-backed data stores.
 */

import DuplicateIndexError from "../../errors/DuplicateIndexError.js";
import {Error} from "mongoose";
import createHttpError from "http-errors";
import type {PersistenceManagerConstructor, PersistenceManagerMethods} from "./PersistenceManager.types.js";

/**
 * **PersistenceManager**
 *
 * Centralizes translation of low-level persistence errors into
 * domain- or HTTP-level errors suitable for API responses.
 */
class PersistenceManager implements PersistenceManagerMethods {
    protected modelName: string;

    constructor({modelName}: PersistenceManagerConstructor) {
        this.modelName = modelName;
    }

    public checkDuplicateIndexString(indexString: string): void {
        console.debug("Duplicate Index: ", {
            index: indexString,
            model: this.modelName, message: "Override to catch duplicate indexes."},
        );
    }

    public checkDuplicateIndexError(error: unknown): void {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            const indexString = (error as any).errmsg.match(/index: (\S+)/)?.[1];

            this.checkDuplicateIndexString(indexString);

            throw new DuplicateIndexError({
                message: `Duplicate Error: ${indexString}`,
                index: indexString,
                model: this.modelName,
            });
        }
    }

    public checkDocumentNotFoundError(error: unknown, code: number, message: string): void {
        if (error instanceof Error && error.name === "DocumentNotFoundError") {
            throw createHttpError(code, message);
        }
    }

    public throwFetchError(error: unknown): never {
        this.checkDocumentNotFoundError(error, 404, "Not found!");
        throw error;
    }

    public throwPersistError(error: unknown): never {
        this.checkDocumentNotFoundError(error, 500, "An error occurred. Please try again.");
        this.checkDuplicateIndexError(error);

        throw error;
    }
}

export {
    PersistenceManager
}