import AuthController from "../controller/AuthController.js";
import AuthService from "../service/AuthService.js";

export default class AuthServiceProvider {
    static register() {
        const service = new AuthService();
        const controller = new AuthController({service});

        return {
            service,
            controller,
        };
    }
}