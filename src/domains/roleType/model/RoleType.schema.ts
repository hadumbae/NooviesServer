import { Schema } from "mongoose";
import type IRoleType from "./RoleType.interface.js";
import RoleTypeDepartmentConstant from "../constants/RoleTypeDepartmentConstant.js";
import RoleTypeCastCategoryConstant from "../constants/RoleTypeCastCategoryConstant.js";
import RoleTypeCrewCategoryConstant from "../constants/RoleTypeCrewCategoryConstant.js";

/**
 * Mongoose schema for {@link IRoleType}.
 *
 * Defines the structure, validation rules, and database constraints
 * for movie role documents.
 */
export const RoleTypeSchema: Schema<IRoleType> = new Schema<IRoleType>({
    /**
     * The name of the role (e.g., "Director", "Actor").
     *
     * - Required.
     * - Trimmed.
     * - 1–150 characters.
     */
    roleName: {
        type: String,
        trim: true,
        minlength: [1, "Required. Must not be an empty string."],
        maxlength: [150, "Must not be more than 150 characters."],
        required: true,
    },

    /**
     * The department the role belongs to.
     *
     * - Required.
     * - Must be one of the values defined in {@link RoleTypeDepartmentConstant}.
     */
    department: {
        type: String,
        enum: {
            values: RoleTypeDepartmentConstant,
            message: "Invalid Department Value.",
        },
        required: true,
    },

    /**
     * The category of the role within the department.
     *
     * - Required.
     * - Conditional validation based on {@link department}:
     *   - If {@link department} is "CREW", must be one of the values in {@link RoleTypeCrewCategoryConstant}.
     *   - If {@link department} is "CAST", must be one of the values in {@link RoleTypeCastCategoryConstant}.
     */
    category: {
        type: String,
        validate: {
            message: "Invalid value.",
            validator: function (value) {
                if (this.department === "CREW") {
                    return RoleTypeCrewCategoryConstant.includes(value);
                }
                if (this.department === "CAST") {
                    return RoleTypeCastCategoryConstant.includes(value);
                }
                return false;
            },
        },
        required: true,
    },

    /**
     * Optional description of the role's purpose or duties.
     *
     * - Trimmed.
     * - Maximum 1000 characters.
     * - Empty strings are converted to `undefined`.
     */
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Must not be more than 1000 characters."],
        default: null,
        set: (value: string | undefined | null) => (typeof value === "string" && value !== "" ? value : undefined),
    },
}, {
    /**
     * Automatically adds `createdAt` and `updatedAt` fields.
     */
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});

/**
 * Compound unique index to prevent duplicate role names in the same department.
 */
RoleTypeSchema.index({ roleName: 1, department: 1 }, { unique: true });
