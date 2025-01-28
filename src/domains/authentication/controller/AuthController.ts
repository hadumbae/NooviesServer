import type {Request, Response} from 'express';
import createHttpError from "http-errors";
import type {IAuthService} from "../service/AuthService.js";
import type {UserRegisterData} from "../schema/UserRegisterSubmitSchema.js";

export interface IAuthController {
    register(req: Request, res: Response): Promise<Response>;

    login(req: Request, res: Response): Promise<Response>;

    logout(req: Request, res: Response): Response;

    toggleAdmin(req: Request, res: Response): Promise<Response>;

    verifyAdminStatus(req: Request, res: Response): Promise<Response>;
}

export default class AuthController implements IAuthController {
    private service: IAuthService;

    constructor({service}: { service: IAuthService }) {
        this.service = service;
    }

    async register(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody as UserRegisterData;
        if (!data) throw createHttpError(400, "Missing Request Data.");

        await this.service.register(data);

        return res
            .status(200)
            .json({message: "Registered successfully. Proceed to Login."});
    }

    async login(req: Request, res: Response): Promise<Response> {
        const data = req.validatedBody;
        if (!data) throw createHttpError(400, "Missing Request Data.");

        const {email, password} = data;
        const loginData = await this.service.login({email, password});
        const cookieOptions = {secure: false, maxAge: 86400000};

        return res
            .status(200)
            .cookie("hasAuthToken", true, cookieOptions)
            .cookie("authToken", loginData.token, {httpOnly: true, ...cookieOptions})
            .json(loginData);
    }

    logout(req: Request, res: Response): Response {
        return res
            .status(200)
            .clearCookie("hasAuthToken")
            .clearCookie("authToken")
            .json({message: "Logged out."});
    }

    async verifyAdminStatus(req: Request, res: Response): Promise<Response> {
        const {authUserID, authUserAdmin} = req;

        return res
            .status(200)
            .json({userID: authUserID, isAdmin: authUserAdmin});
    }

    async toggleAdmin(req: Request, res: Response): Promise<Response> {
        const {_id} = req.params;
        await this.service.toggleAdmin({userID: _id});
        return res.status(200).json({
            message: "User Admin Status toggled successfully."
        });
    }
}