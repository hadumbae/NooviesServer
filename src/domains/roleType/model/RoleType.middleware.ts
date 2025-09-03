import {RoleTypeSchema} from "./RoleType.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import type IRoleType from "./RoleType.interface.js";
import MovieCredit from "../../movieCredit/models/MovieCredit.js";

/**
 * Pre-hook for `find`, `findOne`, and `findOneAndUpdate` queries.
 *
 * If the query is executed in **lean mode** with virtuals enabled
 * (`.lean({ virtuals: true })`), this middleware ensures that the
 * `creditCount` virtual is populated automatically.
 *
 * This makes sure consumers of lean queries still receive the
 * correct `creditCount` values without having to explicitly call
 * `.populate("creditCount")` every time.
 *
 * @param this - The query object on which the hook is executed.
 */
RoleTypeSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    { query: true },
    async function (this: Query<any, IRoleType>) {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            this.populate([{ path: "creditCount" }]);
        }
    }
);

/**
 * Pre-hook for `deleteOne` (document middleware).
 *
 * When a single RoleType document is deleted, this middleware:
 * - Deletes all associated `MovieCredit` documents that reference
 *   the RoleType being removed.
 * - Sets a temporary `_wasUpdated` flag on the document instance,
 *   which can be used downstream to detect cascading changes.
 *
 * @param this - The hydrated RoleType document being deleted.
 */
RoleTypeSchema.pre(
    "deleteOne",
    { document: true },
    async function (this: HydratedDocument<IRoleType>) {
        const { _id } = this;
        (this as any)._wasUpdated = true;
        await MovieCredit.deleteMany({ roleType: _id });
    }
);

/**
 * Pre-hook for `deleteOne` and `deleteMany` (query middleware).
 *
 * When one or more RoleType documents are deleted via a query, this
 * middleware:
 * - Deletes all `MovieCredit` documents associated with the matching
 *   RoleTypes.
 * - Sets a temporary `_wasUpdated` flag on the query instance to mark
 *   that a cascading update was triggered.
 *
 * @param this - The query object that triggered the delete operation.
 */
RoleTypeSchema.pre(
    ["deleteOne", "deleteMany"],
    { query: true, document: false },
    async function (this: Query<any, IRoleType>) {
        const { _id } = this.getFilter();
        if (!_id) return;

        (this as any)._wasUpdated = true;
        await MovieCredit.deleteMany({ roleType: _id });
    }
);