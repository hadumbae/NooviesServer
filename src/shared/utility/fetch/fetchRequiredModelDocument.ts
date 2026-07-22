/**
 * @file Required document fetch utility.
 * @filename fetchRequiredModelDocument.ts
 */

import type {FetchRequiredByIdentifierConfig} from "@/shared/_types/fetch-utils/FetchRequiredByIdentifierConfig";
import type {ModelObject} from "@/shared/_types/model/ModelObject";
import populateQuery from "../mongoose/populateQuery.js";
import type {DocumentType} from "@/shared/_types/mongoose/DocumentType";
import createHttpError from "http-errors";

/**
 * Fetches a single document by `_id` or `slug`.
 *
 * Throws a `404` error when no document is found.
 *
 * @typeParam TSchema - Schema field shape for the model.
 */
export async function fetchRequiredModelDocument<TSchema extends ModelObject>(
    {model, _id, slug, options, notFoundMessage}: FetchRequiredByIdentifierConfig<TSchema>
): Promise<DocumentType<TSchema>> {
    const filter = _id ? {_id} : {slug};
    const query = model.findOne(filter);

    const doc = await populateQuery({query, config: options});

    if (!doc) {
        throw createHttpError(404, notFoundMessage ?? "Not Found.")
    }

    return doc;
}