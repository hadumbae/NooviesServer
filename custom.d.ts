import {Types} from "mongoose";

declare module "express" {
    export interface Request {
        authUserID?: Types.ObjectId;
        authUserAdmin?: boolean;

        validatedBody?: any;
        validatedParams?: Record<any, any>;
        validatedQuery?: Record<any, any>;
        validatedFiles?: [];

        unsetFields?: any;
    }
}