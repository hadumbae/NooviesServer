/**
 * @file RoleTypePersistenceManager.ts
 *
 * Handles RoleType-specific persistence concerns,
 * including database error translation.
 */

import {PersistenceManager} from "../../../../shared/repository/managers/PersistenceManager.js";
import type {PersistenceManagerMethods} from "../../../../shared/repository/managers/PersistenceManager.types.js";
import DuplicateIndexError from "../../../../shared/errors/DuplicateIndexError.js";
import RoleTypeModel from "../../model/RoleType.model.js";

/**
 * Persistence manager for RoleType.
 *
 * Converts low-level database errors into
 * domain-safe application errors.
 */
export class RoleTypePersistenceManager
    extends PersistenceManager
    implements PersistenceManagerMethods
{
    constructor() {
        super({modelName: RoleTypeModel.modelName});
    }

    /**
     * Detects MongoDB duplicate index errors and
     * throws a domain-level DuplicateIndexError.
     *
     * @param error Unknown persistence error
     * @throws DuplicateIndexError
     */
    public checkDuplicateIndexError(error: unknown): void {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as any).code === 11000
        ) {
            const indexName = (error as any).errmsg?.match(/index: (\S+)/)?.[1];

            throw new DuplicateIndexError({
                message: `Duplicate Error: ${indexName}`,
                index: indexName,
                model: this.modelName,
            });
        }
    }
}
