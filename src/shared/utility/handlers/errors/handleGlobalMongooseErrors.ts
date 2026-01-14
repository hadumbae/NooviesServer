import type {Response} from "express";

/**
 * Determines whether an error is a globally handled Mongoose error.
 *
 * Currently detects:
 * - `DocumentNotFoundError`
 * - MongoDB duplicate index errors (`code === 11000`)
 *
 * @param error - Unknown error thrown during request handling.
 * @returns `true` if the error matches a known global Mongoose error.
 */
export const isGlobalMongooseError = (error: unknown) => {
    return (error instanceof Error && error.name === "DocumentNotFoundError") ||
        (typeof error === "object" && error !== null && "code" in error && error.code === 11000);
};

/**
 * Handles globally recognized Mongoose errors and sends
 * the appropriate HTTP response.
 *
 * @param error - The detected Mongoose-related error.
 * @param res - Express response object.
 *
 * @remarks
 * - `DocumentNotFoundError` → **404**
 * - Duplicate index (`11000`) → **409**
 */
export const handleGlobalMongooseErrors = (error: unknown, res: Response) => {
    if (error instanceof Error && error.name === "DocumentNotFoundError") {
        res.status(404).json({message: "Not found!"});
        return;
    }

    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
        const indexString = (error as any).errmsg.match(/index: (\S+)/)?.[1];

        console.warn("Duplicate Index Error On:", indexString);
        res.status(409).json({message: "Duplicate index!", errors: []});
    }
};
