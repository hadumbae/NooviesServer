/**
 * @fileoverview Defines type aliases for Express controller functions used across the application.
 */

import type {Request, Response} from "express";

/** Represents a synchronous Express controller function. */
export type ControllerFunc = (req: Request, res: Response) => Response;

/** Represents an asynchronous Express controller function. */
export type ControllerAsyncFunc = (req: Request, res: Response) => Promise<Response>;
