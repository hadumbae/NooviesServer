/**
 * @fileoverview Utility for retrieving non-sensitive customer profile information by unique code.
 */

import {User} from "@/domains/users/model/user/User.model";
import createHttpError from "http-errors";
import type {UserUniqueCode} from "@/domains/users/_feat/manage-user-unique-code/schemas";
import type {DocumentType} from "@/shared/_types/mongoose/DocumentType";
import type {LeanUserSchemaFields} from "@/domains/users/model/user/User.types";

/** Retrieves a customer document by their unique system code and throws a 404 error if not found. */
export async function fetchRequiredCustomerByCode(
    code: UserUniqueCode
): Promise<DocumentType<LeanUserSchemaFields>> {
    const customer = await User
        .findOne({uniqueCode: code})
        .select("_id name email uniqueCode");

    if (!customer) {
        throw createHttpError(404, "Customer Not Found.");
    }

    return customer;
}