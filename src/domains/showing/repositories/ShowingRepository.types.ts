/**
 * @file ShowingRepositoryCRUD.ts
 *
 * Repository contract for the Showing domain.
 *
 * Extends the generic {@link BaseRepositoryCRUD} interface with
 * Showing-specific persistence behavior.
 *
 * This interface defines additional responsibilities that cannot be
 * expressed generically at the base repository level, such as
 * domain-aware slug generation.
 */

import type BaseRepositoryCRUD from "../../../shared/repository/BaseRepositoryCRUD.js";
import type { ModelObject } from "../../../shared/types/ModelObject.js";
import type { PopulatePath } from "../../../shared/types/mongoose/PopulatePath.js";
import type { ShowingInput } from "../schema/ShowingInputSchema.js";

/**
 * Constructor options for a Showing repository.
 *
 * @remarks
 * Allows configuring default population behavior for Showing queries,
 * typically including movie, theatre, and screen references.
 */
export type ShowingRepositoryConstructor = {
    /** Default populate paths applied to repository queries. */
    readonly populateRefs?: PopulatePath[];
};

/**
 * CRUD repository interface for Showings.
 *
 * @typeParam TSchema - Persisted Showing document shape.
 *
 * @remarks
 * In addition to standard CRUD and pagination operations, this interface
 * exposes domain-specific behavior required by the Showing aggregate,
 * such as deterministic slug generation based on showing attributes.
 */
export interface ShowingRepositoryCRUD<TSchema extends ModelObject>
    extends BaseRepositoryCRUD<TSchema> {

    /**
     * Generate a unique slug for a Showing.
     *
     * @remarks
     * Implementations are expected to:
     * - Derive the slug from domain-relevant attributes (e.g. movie, theatre, time)
     * - Ensure uniqueness within the Showing collection
     * - Handle collisions deterministically
     *
     * This method does **not** persist the slug; it only generates it.
     *
     * @param data - Validated showing input data.
     * @returns A unique, URL-safe slug string.
     */
    generateShowingSlug(data: ShowingInput): Promise<string>;
}
