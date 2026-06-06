/**
 * @fileoverview Defines virtual properties for the RoleType schema.
 *
 */
import {RoleTypeSchema} from "./RoleType.schema.js";

RoleTypeSchema.virtual("creditCount", {
    ref: "MovieCredit",
    localField: "_id",
    foreignField: "roleType",
    count: true,
});