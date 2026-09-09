/**
 * @fileoverview Express controller for handling user account registration requests.
 */

import type {Request, Response} from "express";
import type {UserRegisterInput} from "@/domains/authentication/_feat/register-user/UserRegisterInputSchema";
import createHttpError from "http-errors";
import {registerUser} from "@/domains/authentication/_feat/register-user/regiserUser";

/** Registers a new user account and returns a success message. */
export async function postRegisterUser(req: Request, res: Response): Promise<Response> {
    const data = req.validatedBody as UserRegisterInput;
    if (!data) throw createHttpError(400, "Missing Request Data.");

    await registerUser({data});

    return res.status(200).json({message: "Registered successfully. Proceed to Login."});
}