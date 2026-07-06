/**
 * @fileoverview Service for fetching a single person document by ID or slug with error handling.
 */

import {Types} from "mongoose";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema";
import type {QueryConfig} from "@/shared/_types";
import type {DocumentType} from "@/shared/types/mongoose/DocumentType";
import {Person, type PersonSchemaFields} from "@/domains/persons";
import populateQuery from "@/shared/utility/mongoose/populateQuery";
import {fetchOrFailQuery} from "@/shared/utility/mongoose/fetchOrFailQuery";

/** Configuration for fetching a person by either a unique ID or a slug. */
type FetchConfig = (
    | { _id: Types.ObjectId, slug?: never }
    | { _id?: never, slug: SlugString }
) & {
    options?: Omit<QueryConfig, "limit">
};

/** Fetches a person document and throws a 404 error if the record is not found. */
export async function fetchRequiredPerson(
    {_id, slug, options}: FetchConfig
): Promise<DocumentType<PersonSchemaFields>> {
    const query = populateQuery({
        query: _id ? Person.findById(_id) : Person.findOne({slug}),
        config: options,
    });

    return fetchOrFailQuery({
        query,
        httpCode: 404,
        errorMessage: "Person Not Found.",
    });
}
