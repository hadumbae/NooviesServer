import AuthController from "../controller/AuthController.js";
import AuthService from "../service/AuthService.js";

/**
 * Provider class for authentication services and controllers.
 *
 * Handles creation and wiring of `AuthService` and `AuthController` instances.
 *
 * @example
 * ```ts
 * import AuthServiceProvider from './AuthServiceProvider.js';
 *
 * const { service, controller } = AuthServiceProvider.register();
 *
 * // `service` is an instance of AuthService
 * // `controller` is an instance of AuthController
 * ```
 */
export default class AuthServiceProvider {
    /**
     * Creates and returns a new authentication service and controller instance.
     *
     * @returns An object containing:
     * - `service`: Instance of `AuthService`
     * - `controller`: Instance of `AuthController` wired with the service
     */
    static register() {
        const service = new AuthService();
        const controller = new AuthController({ service });

        return {
            service,
            controller,
        };
    }
}
