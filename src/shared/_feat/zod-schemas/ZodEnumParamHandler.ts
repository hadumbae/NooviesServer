/**
 * @fileoverview Zod enum error parameter handler.
 */

import {z} from "zod";

type HandlerConfig = {
    invalidValue?: string;
    invalidType?: string;
}

/**
 * Creates a Zod parameter configuration with custom error messages for enum validation.
 */
export function ZodEnumParamHandler(
    {invalidValue, invalidType}: HandlerConfig = {},
): z.RawCreateParams {
    return (
        {
            errorMap: (issue, ctx) => {
                if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                    return {message: invalidValue ?? "Invalid value."};
                }

                if (issue.code === z.ZodIssueCode.invalid_type) {
                    return {message: invalidType ?? "Must be a valid string value."};
                }

                return {message: ctx.defaultError};
            },
        }
    )
}