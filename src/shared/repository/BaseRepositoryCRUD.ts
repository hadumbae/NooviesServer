/**
 * @file BaseRepositoryCRUD.ts
 *
 * Persistence-agnostic CRUD contract for repositories.
 *
 * Defines the minimal interface consumed by services and controllers,
 * independent of the underlying data layer implementation.
 */

import type {ModelObject} from "../types/ModelObject.js";
import type {WriteMethods} from "./operations/CRUDWriter.types.js";
import type {DeleteMethods} from "./operations/CRUDDeleter.types.js";
import type {ReadMethods} from "./operations/CRUDReader.types.js";

/**
 * Repository CRUD interface.
 *
 * @template TSchema - Persisted document shape
 * @template TInput  - Input payload shape for create/update operations
 */
export default interface BaseRepositoryCRUD<
    TSchema extends ModelObject,
    TInput = unknown
> extends
    ReadMethods<TSchema>,
    WriteMethods<TSchema, TInput>,
    DeleteMethods
{
}
