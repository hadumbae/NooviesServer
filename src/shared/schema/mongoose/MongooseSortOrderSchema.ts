import {z} from "zod";

export const MongooseSortOrderSchema = z.union(
    [
        z.literal(1),
        z.literal(-1),
        z.literal("asc"),
        z.literal("desc"),
        z.literal("ascending"),
        z.literal("descending"),
    ],
    {message: "A valid sort order is required."}
);