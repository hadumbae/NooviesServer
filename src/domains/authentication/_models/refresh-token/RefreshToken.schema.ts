/**
 * @fileoverview Mongoose schema definition and validation rules for the RefreshToken collection.
 */

import {isIP} from "node:net";
import {Schema} from "mongoose";
import type {RefreshTokenSchemaFields} from "@/domains/authentication/_models/refresh-token/RefreshToken.types";

/** Mongoose schema definition for storing and indexing refresh tokens. */
export const RefreshTokenSchema = new Schema<RefreshTokenSchemaFields>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."],
        index: true,
    },

    tokenHash: {
        type: String,
        required: [true, "Token hash is required."],
        unique: true,
    },

    expiresAt: {
        type: Date,
        required: [true, "Expiration date is required."],
        expires: 0,
    },

    revoked: {
        type: Boolean,
        default: false,
    },

    ip: {
        type: String,
        validate: {
            message: "IP address must be a valid IPv4 or IPv6 address.",
            validator: (value: string) => isIP(value) !== 0,
        }
    },

    family: {
        type: String,
        required: [true, "Family is required."],
        index: true,
    },
}, {timestamps: true});