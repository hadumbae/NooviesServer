import AuthRegisterService from "../service/AuthRegisterService.js";
import AuthLoginService from "../service/AuthLoginService.js";
import AuthController from "../controller/AuthController.js";

export default class AuthServiceProvider {
    static register() {
        const registerService = AuthRegisterService;
        const loginService = AuthLoginService;

        const controller = new AuthController({
            registerService,
            loginService
        });

        return {
            registerService,
            loginService,
            controller,
        };
    }
}