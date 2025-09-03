import {Model, model} from "mongoose";
import type IRoleType from "./RoleType.interface.js";
import {RoleTypeSchema} from "./RoleType.schema.js";

/**
 * Mongoose model for {@link IRoleType} documents.
 *
 * Provides an interface to interact with the `RoleType` collection
 * in MongoDB, including querying, creating, updating, and deleting role documents.
 *
 * Example usage:
 * ```ts
 * // Create a new role
 * const director = await RoleTypeModel.create({
 *   roleName: "Director",
 *   department: "CREW",
 *   description: "Leads the film production."
 * });
 *
 * // Find all roles in the CAST department
 * const castRoles = await RoleTypeModel.find({ department: "CAST" });
 * ```
 */
const RoleTypeModel: Model<IRoleType> = model<IRoleType>("RoleType", RoleTypeSchema);

export default RoleTypeModel;