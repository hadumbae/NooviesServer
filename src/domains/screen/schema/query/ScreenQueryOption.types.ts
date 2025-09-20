import { z } from "zod";
import {
    ScreenQueryFiltersSchema,
    ScreenQueryOptionsSchema,
    ScreenQueryParamsSchema,
    ScreenQuerySortsSchema
} from "./ScreenQueryOption.schema.js";

export type ScreenQueryFilters = z.infer<typeof ScreenQueryFiltersSchema>;

export type ScreenQuerySorts = z.infer<typeof ScreenQuerySortsSchema>;

export type ScreenQueryParams = z.infer<typeof ScreenQueryParamsSchema>;

export type ScreenQueryOptions = z.infer<typeof ScreenQueryOptionsSchema>;
