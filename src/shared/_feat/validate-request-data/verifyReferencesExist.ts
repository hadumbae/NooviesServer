/**
 * @fileoverview Express middleware factory for validating the existence of referenced database entities.
 */

import {type Model} from "mongoose";
import type {NextFunction, Request, Response} from "express";
import type {ZodIssue} from "zod";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";

type ReferenceCheck = {
    model: Model<any>;
    key: string;
}

type VerifyConfig = {
    refs: ReferenceCheck[];
    statusCode?: number;
}

/** Creates middleware that verifies foreign key references exist in the database before proceeding. */
export function verifyReferencesExist({refs, statusCode = 422}: VerifyConfig) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const results = await Promise.all(
            refs.map(async ({model, key}) => model.exists({_id: req.validatedBody[key]})),
        );

        const missing = refs.filter((_, i) => !results[i]);
        if (missing.length > 0) {
            const errors: ZodIssue[] = missing.map(
                ({key}): ZodIssue => ({code: "custom", path: [key], message: "Invalid value!"})
            );

            throw new RequestValidationError({
                errors,
                statusCode,
                message: "Invalid request data.",
            });
        }

        next();
    }
}