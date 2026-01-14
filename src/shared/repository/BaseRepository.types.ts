import type {CRUDReader} from "./operations/CRUDReader.js";
import type {CRUDWriter} from "./operations/CRUDWriter.js";
import type {CRUDDeleter} from "./operations/CRUDDeleter.js";
import type {ModelObject} from "../types/ModelObject.js";
import type {CRUDBaseConstructor} from "./base/CRUDBase.types.js";

/**
 * Constructor parameters for {@link BaseRepository}.
 *
 * Allows optional injection of CRUD operation implementations.
 *
 * @template TSchema - Persisted document shape
 * @template TInput  - Input payload shape
 */
export type BaseRepositoryConstructor<
    TSchema extends ModelObject,
    TInput = unknown
> = CRUDBaseConstructor<TSchema> & {
    /** Optional reader override */
    reader?: CRUDReader<TSchema>;
    /** Optional writer override */
    writer?: CRUDWriter<TSchema, TInput>;
    /** Optional deleter override */
    deleter?: CRUDDeleter<TSchema>;
};
