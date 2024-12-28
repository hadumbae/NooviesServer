import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IMovieController} from "../controller/MovieController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";
import {MovieSchema} from "../schema/MovieSchema.js";

const { controller } = MovieServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IMovieController> = {
    controller,
    createValidator: ZodAsyncValidator(MovieSchema),
    updateValidator: ZodAsyncValidator(MovieSchema),
};

const routes = createBaseRoutes(baseConfig);

export default routes;