import MovieCreditServiceProvider from "../provider/MovieCreditServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IMovieCreditController} from "../controllers/MovieCreditController.js";
import validateZodSchema from "../../../shared/utility/zod/validateZodSchema.js";
import {MovieCreditInputSchema} from "../schemas/MovieCreditInputSchema.js";

const {crudController} = MovieCreditServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IMovieCreditController> = {
    crudController: crudController,
    createValidator: validateZodSchema(MovieCreditInputSchema),
    updateValidator: validateZodSchema(MovieCreditInputSchema),
}

const routes = createBaseRoutes(baseConfig);

export default routes;