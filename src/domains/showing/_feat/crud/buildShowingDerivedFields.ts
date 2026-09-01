/**
 * @fileoverview Utility functions for calculating and building derived fields for showing domain entities.
 */

import type {ShowingInput, ShowingSchemaFields} from "@/domains/showing";
import {createTheatreSnapshot} from "@/domains/theatre/utilities";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";

/** Constructs derived fields such as theatre snapshots required for showing documents. */
export async function buildShowingDerivedFields(data: Partial<ShowingInput>): Promise<Partial<ShowingSchemaFields>> {
    if (data.theatre === undefined) {
        throw new RequestValidationError({
            statusCode: 422,
            message: "Theatre is required.",
            errors: [
                {code: "custom", message: "Theatre is required.", path: ["theatre"]}
            ]
        });
    }

    return {
        theatreSnapshot: await createTheatreSnapshot(data.theatre)
    };
}