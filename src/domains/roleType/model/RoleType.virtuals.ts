import {RoleTypeSchema} from "./RoleType.schema.js";

/**
 * Adds a virtual property `creditCount` to the RoleType schema.
 *
 * This virtual property represents the number of `MovieCredit` documents
 * associated with a given RoleType. It does not store data in the database,
 * but allows you to retrieve the count of related `MovieCredit` documents.
 *
 * @property {string} ref - The referenced model name (`MovieCredit`).
 * @property {string} localField - The field in this schema (`_id`) that links to the foreign field.
 * @property {string} foreignField - The field in the referenced schema (`roleType`) that stores the relation.
 * @property {boolean} count - Indicates that only the count of matching documents should be returned.
 */
RoleTypeSchema.virtual("creditCount", {
    ref: "MovieCredit",
    localField: "_id",
    foreignField: "roleType",
    count: true,
});