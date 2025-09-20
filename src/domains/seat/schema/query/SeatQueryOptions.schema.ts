import { z } from "zod";

import { SeatTypeEnum } from "../enum/SeatTypeEnum.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamBooleanSchema } from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import {URLParamPositiveNumberSchema} from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";

export const SeatQueryFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    row: URLParamStringSchema,
    seatNumber: URLParamPositiveNumberSchema,
    seatLabel: URLParamStringSchema,
    seatType: SeatTypeEnum.optional(),
    isAvailable: URLParamBooleanSchema,
    theatre: URLParamObjectIDSchema,
    screen: URLParamObjectIDSchema,
    priceMultiplier: URLParamNonNegativeNumberSchema,
});

export const SeatQuerySortsSchema = z.object({
    sortByTheatre: URLParamMongooseSortOrderSchema,
    sortByScreen: URLParamMongooseSortOrderSchema,
    sortByRow: URLParamMongooseSortOrderSchema,
    sortBySeatNumber: URLParamMongooseSortOrderSchema,
    sortBySeatLabel: URLParamMongooseSortOrderSchema,
    sortBySeatType: URLParamMongooseSortOrderSchema,
    sortByIsAvailable: URLParamMongooseSortOrderSchema,
    sortByPriceMultiplier: URLParamMongooseSortOrderSchema,
});

export const SeatQueryOptionsSchema = SeatQueryFiltersSchema.merge(SeatQuerySortsSchema);
