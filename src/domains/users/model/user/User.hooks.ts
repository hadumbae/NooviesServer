/**
 * @fileoverview Mongoose middleware hooks for the User model to handle automatic population of virtual fields.
 */

import {UserSchema} from "@/domains/users/model/user/User.schema";
import type {UserSchemaFields} from "@/domains/users";
import type {PopulateOptions, Query} from "mongoose";
import {populateLeanVirtuals} from "@/shared/_feat";

UserSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {document: false, query: true},
    function (this: Query<any, UserSchemaFields>, next: () => void) {
        const options: PopulateOptions[] = [
            {path: "reviewCount"},
            {path: "reservationCount"},
            {path: "activeReservationCount"},
        ];

        populateLeanVirtuals({
            query: this,
            lean: this._mongooseOptions.lean,
            options
        })

        next();
    }
)