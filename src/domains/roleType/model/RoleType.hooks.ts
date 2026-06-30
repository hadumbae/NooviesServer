/**
 * @fileoverview Middleware hooks for the RoleType schema to handle virtual population and cascading deletes.
 */

import {RoleTypeSchema} from "./RoleType.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import type {RoleTypeSchemaFields} from "@/domains/roleType/model/RoleType.types";
import MovieCredit from "../../movieCredit/models/MovieCredit.model.js";

RoleTypeSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    { query: true },
    async function (this: Query<any, RoleTypeSchemaFields>) {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            this.populate([{ path: "creditCount" }]);
        }
    }
);

RoleTypeSchema.pre(
    "deleteOne",
    { document: true },
    async function (this: HydratedDocument<RoleTypeSchemaFields>) {
        const { _id } = this;
        (this as any)._wasUpdated = true;
        await MovieCredit.deleteMany({ roleType: _id });
    }
);

RoleTypeSchema.pre(
    ["deleteOne", "deleteMany"],
    { query: true, document: false },
    async function (this: Query<any, RoleTypeSchemaFields>) {
        const { _id } = this.getFilter();
        if (!_id) return;

        (this as any)._wasUpdated = true;
        await MovieCredit.deleteMany({ roleType: _id });
    }
);