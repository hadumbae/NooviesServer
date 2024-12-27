import type {Request, Response} from 'express';
import type {IAuthRegisterData, IAuthRegisterService} from "../service/AuthRegisterService.interface.js";
import type {IAuthLoginService} from "../service/AuthLoginService.interface.js";
import createHttpError from "http-errors";

interface IAuthControllerParams {
    registerService: IAuthRegisterService,
    loginService: IAuthLoginService,
}

export interface IAuthController {
    login(req: Request, res: Response): Promise<Response>;
    register(req: Request, res: Response): Promise<Response>;
    toggleAdmin(req: Request, res: Response): Promise<Response>;
}

export default class AuthController implements IAuthController {
    private registerService: IAuthRegisterService;
    private loginService: IAuthLoginService;

    constructor(params: IAuthControllerParams) {
        this.registerService = params.registerService;
        this.loginService = params.loginService;
    }

    async register(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody;
        if (!data) throw createHttpError(400, "Missing Request Data.");

        await this.registerService.register(data as IAuthRegisterData);

        return res.status(200).json({
            message: "User registered successfully."
        });
    }

    async login(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody;
        if (!data) throw createHttpError(400, "Missing Request Data.");

        const {email, password} = data;
        const loginData = await this.loginService.login({email, password});

        return res.status(200).json({
            message: "Logged In!",
            data: loginData,
        });
    }

    async toggleAdmin(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        await this.registerService.toggleAdmin({userID: _id});
        return res.status(200).json({
            message: "User Admin Status toggled successfully."
        });
    }
}