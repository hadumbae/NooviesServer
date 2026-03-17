/**
 * @file Required document fetch utility.
 * @filename fetchRequiredModelDocument.ts
 */

import type {FetchRequiredByIdentifierParams} from "../../types/FetchRequiredTypes.js";
import type {ModelObject} from "../../types/ModelObject.js";
import populateQuery from "../mongoose/populateQuery.js";
import type {DocumentType} from "../../types/mongoose/DocumentType.js";
import createHttpError from "http-errors";

/**
 * Fetches a single document by `_id` or `slug`.
 *
 * Throws a `404` error when no document is found.
 *
 * @typeParam TSchema - Schema field shape for the model.
 */
export async function fetchRequiredModelDocument<TSchema extends ModelObject>(
    {model, _id, slug, options, notFoundMessage}: FetchRequiredByIdentifierParams<TSchema>
): Promise<DocumentType<TSchema>> {
    const filter = _id ? {_id} : {slug};
    const query = model.findOne(filter);

    const doc = await populateQuery({query, options});

    if (!doc) {
        throw createHttpError(404, notFoundMessage ?? "Not Found.")
    }

    return doc;
}