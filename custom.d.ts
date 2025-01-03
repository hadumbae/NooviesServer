declare namespace Express {
    export interface Request {
        authUserID?: string;
        authUserAdmin?: boolean;

        validatedBody?: Record<any, any>;
        validatedParams?: Record<any, any>;
        validatedQuery?: Record<any, any>;
        validatedFiles?: [];
    }
}