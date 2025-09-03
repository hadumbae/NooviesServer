    import type {RoleTypeDepartmentEnum} from "../schemas/RoleTypeDepartment.enum.js";
    import {Types} from "mongoose";

    /**
     * Represents a role type within a movie.
     *
     * This interface is used to strongly type Mongoose documents
     * that describe different roles in a film production,
     * such as actors, directors, or crew members.
     */
    export default interface IRoleType {
        /** Unique identifier for the role (MongoDB ObjectId). */
        readonly _id: Types.ObjectId;

        /** The name of the role (e.g. "Director", "Actor"). */
        roleName: string;

        /**
         * The department this role belongs to.
         *
         * Restricted to values defined in {@link RoleTypeDepartmentEnum},
         * which is `"CREW" | "CAST"`.
         */
        department: RoleTypeDepartmentEnum;

        /**
         * Optional description of the role’s purpose or duties.
         *
         * Must be 1–1000 characters if provided.
         */
        description?: string;
    }