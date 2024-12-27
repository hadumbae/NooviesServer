import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IMovieController} from "../controller/MovieController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";
import {MovieSubmitSchema} from "../schema/MovieSubmitSchema.js";

const { controller } = MovieServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IMovieController> = {
    controller,
    createValidator: ZodAsyncValidator(MovieSubmitSchema),
    updateValidator: ZodAsyncValidator(MovieSubmitSchema),
};

const routes = createBaseRoutes(baseConfig);

export default routes;