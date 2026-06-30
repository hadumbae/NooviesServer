/**
 * @fileoverview Defines the Mongoose schema and validation logic for role types.
 */

import {Schema} from "mongoose";
import {
    RoleTypeDepartmentConstant
} from "@/domains/roleType/validation/constants/RoleTypeDepartmentConstant";
import {
    RoleTypeCastCategoryConstant
} from "@/domains/roleType/validation/constants/RoleTypeCastCategoryConstant";
import {
    RoleTypeCrewCategoryConstant
} from "@/domains/roleType/validation/constants/RoleTypeCrewCategoryConstant";
import type {RoleTypeSchemaFields} from "@/domains/roleType/model/RoleType.types";

/** Mongoose schema for role type documents. */
export const RoleTypeSchema: Schema<RoleTypeSchemaFields> = new Schema<RoleTypeSchemaFields>({
    roleName: {
        type: String,
        trim: true,
        minlength: [1, "Required. Must not be an empty string."],
        maxlength: [150, "Must not be more than 150 characters."],
        required: true,
    },

    department: {
        type: String,
        enum: {
            values: RoleTypeDepartmentConstant,
            message: "Invalid Department Value.",
        },
        required: true,
    },

    category: {
        type: String,
        validate: {
            message: "Invalid value.",
            validator: function (value) {
                if (this.department === "CREW") return RoleTypeCrewCategoryConstant.includes(value);
                if (this.department === "CAST") return RoleTypeCastCategoryConstant.includes(value);
                return false;
            },
        },
        required: true,
    },

    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Must not be more than 1000 characters."],
        default: null,
        set: (value: string | undefined | null) => (typeof value === "string" && value !== "" ? value : undefined),
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});

