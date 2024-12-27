import {z} from 'zod';

export const PaginationSchema = z.object({
    page: z
        .coerce
        .number({
            required_error: "Page is required.",
            invalid_type_error: "Page must be a number",
        })
        .gte(1),
    perPage: z
        .coerce
        .number({
            required_error: "Per Page is required.",
            invalid_type_error: "Per Page must be a number",
        })
        .gte(1),
});