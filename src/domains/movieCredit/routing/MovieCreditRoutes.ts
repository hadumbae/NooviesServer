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

const {model, crudController} = MovieCreditServiceProvider.register();

const unsetMiddleware = UnsetModelFormFields({model});

const middlewareList: BaseRouteMiddleware<typeof crudController> = {
    path: {
        create: [validateZodSchema(MovieCreditInputSchema), unsetMiddleware],
        update: [validateZodSchema(MovieCreditInputSchema), unsetMiddleware],
    }
};

const baseConfig: IBaseRoutesConfig<IMovieCreditController> = {crudController, middlewareList};

const routes = createBaseRoutes(baseConfig);

export default routes;