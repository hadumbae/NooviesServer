import {Types} from "mongoose";

declare module "express" {
    export interface Request<TSchema = any> {
        authUserID?: Types.ObjectId | string;
        authUserAdmin?: boolean;

        unsetFields?: Partial<TSchema>;
        validatedBody?: Partial<TSchema>;
        validatedParams?: Record<any, any>;
        validatedQuery?: Record<any, any>;
        validatedFiles?: [];
    }
}