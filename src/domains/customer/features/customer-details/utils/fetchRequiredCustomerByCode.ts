/**
 * @file Data access utility for retrieving non-sensitive customer profile information.
 * @filename fetchRequiredCustomerByCode.ts
 */

import User from "@models/User.model";
import createHttpError from "http-errors";
import type {UserUniqueCode} from "@domains/users/validation";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";
import type {LeanUserSchemaFields} from "@models/User.types";

/**
 * Retrieves a customer document by their unique system code, enforcing existence.
 * ---
 * @param code - The validated {@link UserUniqueCode} of the target customer.
 * @returns A promise resolving to the hydrated Lean Mongoose document.
 * @throws {HttpError} 404 if no user matches the provided code.
 */
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