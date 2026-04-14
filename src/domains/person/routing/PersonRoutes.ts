import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type BaseRouteConfig
} from "@shared/routing/BaseRoutes";
import type { IPersonController } from "../controller/PersonController.js";
import PersonServiceProvider from "../provider/PersonServiceProvider.js";
import { PersonInputSchema } from "../schema/PersonInputSchema.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";

/**
 * Destructure the Person model and controller from the service provider.
 */
const { model, controllers: { controller } } = PersonServiceProvider.register();

/**
 * Middleware to remove or unset specific model form fields
 * before creating or updating a Person entity.
 */
const unsetMiddleware = unsetModelFormFields({ model, excludeKeys: ["profileImage"] });

/**
 * Middleware configuration for the base CRUD routes of Person.
 *
 * @type {BaseRouteMiddleware<typeof controller>}
 * @description
 * Validates request bodies using Zod schema and applies field unsetting.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchema(PersonInputSchema), unsetMiddleware],
        update: [validateZodSchema(PersonInputSchema), unsetMiddleware],
    }
};

/**
 * Configuration object for creating base CRUD routes for Person.
 *
 * @type {BaseRouteConfig<IPersonController>}
 */
const baseConfig: BaseRouteConfig<IPersonController> = {
    crudController: controller,
    middlewareList
};

/**
 * Base CRUD routes for Person entity, automatically generated
 * from the controller and middleware configuration.
 */
const routes = createBaseRoutes(baseConfig);

export default routes;
