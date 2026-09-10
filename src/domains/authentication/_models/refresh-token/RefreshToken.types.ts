/**
 * @fileoverview Type definitions for refresh token data models and database entity fields.
 */

import type {UserSchemaFields} from "@/domains/users";
import type {IpString} from "@/shared/schema/strings/IPSchema";
import type {BaseModel, ModelTimestamps} from "@/shared/_types";
import {Types} from "mongoose";

/** Model schema representing a user refresh token entity in the database. */
export type RefreshTokenSchemaFields = BaseModel & ModelTimestamps & {
    user: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    ip?: IpString;
    family: string;
};

/** Represents a refresh token entity with the user reference populated. */
export type PopulatedRefreshToken = Omit<RefreshTokenSchemaFields, "user"> & {
    user: UserSchemaFields;
};