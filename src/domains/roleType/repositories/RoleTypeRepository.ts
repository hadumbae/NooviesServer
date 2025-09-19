import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type IRoleType from "../model/RoleType.interface.js";
import type {ZodIssue} from "zod";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

/**
 * Repository for managing {@link IRoleType} documents.
 *
 * Extends the generic {@link BaseRepository} to provide
 * model-specific error handling and validation for role types.
 *
 * Handles CRUD, pagination, and unique constraint enforcement
 * for role names within departments.
 *
 * ## Unique Constraints
 * - `roleName` must be unique within the same `department`.
 */
export default class RoleTypeRepository extends BaseRepository<IRoleType> {

    /**
     * Throws a structured `ZodParseError` when a unique index constraint is violated.
     *
     * This method intercepts MongoDB duplicate key errors and converts them into
     * field-level Zod issues with actionable messages.
     *
     * ## Handled Index
     * - `roleName_1_department_1` → Prevents duplicate role names within the same department.
     *
     * @param indexString - The name of the MongoDB index that was violated.
     * @throws {ZodParseError} Contains field-level errors and a top-level message
     * explaining the duplicate and how to fix it.
     *
     * @example
     * ```ts
     * try {
     *   await roleTypeRepo.create({ data: { roleName: "Director", department: "CREW" } });
     * } catch (error) {
     *   if (error instanceof ZodParseError) {
     *     console.log(error.errors); // field-specific messages
     *     console.log(error.message); // top-level guidance
     *   }
     * }
     * ```
     */
    protected throwDuplicateError(indexString: string) {
        console.debug("Role Type Repository Duplicate Index: ", indexString);

        if (indexString === "roleName_1_department_1") {
            const errors: ZodIssue[] = [
                {
                    path: ["roleName"],
                    code: "custom",
                    message: "A role with this name already exists in the selected department."
                },
                {
                    path: ["department"],
                    code: "custom",
                    message: "Each role name must be unique within its department."
                },
            ];

            throw new ZodParseError({
                errors,
                message: "Duplicate role detected: role names must be unique per department. Please choose a different role name or department."
            });
        }
    }
}