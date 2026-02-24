/**
 * @file MovieReview CRUD route configuration.
 * MovieReviewCRUDRoutes.ts
 */

import { MovieReviewServiceProvider } from "../provider/MovieReviewServiceProvider.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import type { MovieReviewSchemaFields } from "../model/MovieReview.types.js";
import {
    type BaseRouteConfig,
    type BaseRouteMiddleware,
    createBaseRoutes,
} from "../../../shared/routing/BaseRoutes.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import { MovieReviewCreateInputSchema } from "../schema/MovieReviewCreateInputSchema.js";
import { MovieReviewUpdateInputSchema } from "../schema/MovieReviewUpdateInputSchema.js";

/**
 * Registers CRUD routes and middleware for MovieReview.
 */
const { model, controllers: { crudController } } = MovieReviewServiceProvider.register();

const unsetExclusion: (keyof MovieReviewSchemaFields)[] = [
    "user",
    "movie",
    "rating",
    "isRecommended",
];

const unsetMiddleware = unsetModelFormFields({ model, excludeKeys: unsetExclusion });

const middlewareList: BaseRouteMiddleware<typeof crudController> = {
    path: {
        create: [validateZodSchema(MovieReviewCreateInputSchema), unsetMiddleware],
        update: [validateZodSchema(MovieReviewUpdateInputSchema), unsetMiddleware],
    },
};

const baseConfig: BaseRouteConfig<typeof crudController> = { crudController, middlewareList };

const router = createBaseRoutes(baseConfig);

export {
    router as MovieReviewCRUDRoutes,
};