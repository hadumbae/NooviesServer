import MovieCreditServiceProvider from "../provider/MovieCreditServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type IBaseRoutesConfig
} from "../../../shared/routing/BaseRoutes.js";
import type {IMovieCreditController} from "../controllers/MovieCreditController.js";
import validateZodSchema from "../../../shared/utility/zod/validateZodSchema.js";
import {MovieCreditInputSchema} from "../schemas/MovieCreditInputSchema.js";
import UnsetModelFormFields from "../../../shared/utility/UnsetModelFormFields.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const {model, crudController} = MovieCreditServiceProvider.register();

const unsetMiddleware = UnsetModelFormFields({model});

const middlewareList: BaseRouteMiddleware<typeof crudController> = {
    path: {
        create: [validateZodSchema(MovieCreditInputSchema), unsetMiddleware],
        update: [validateZodSchema(MovieCreditInputSchema), unsetMiddleware],
    }
};

const baseConfig: IBaseRoutesConfig<IMovieCreditController> = {crudController, middlewareList};

const router = createBaseRoutes(baseConfig);

router.get(
    "/query/person/:personID/grouped-by-role-type",
    [isAuth],
    asyncHandler(crudController.fetchGroupedMovieCreditsByPerson.bind(crudController)),
);

export default router;