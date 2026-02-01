/**
 * @file ControllerTypes.ts
 *
 * Shared type aliases for Express controller functions.
 *
 * Provides consistent signatures for both synchronous
 * and asynchronous controllers that always return an
 * Express {@link Response}.
 */

import type {Request, Response} from "express";

/**
 * Synchronous Express controller function.
 *
 * @remarks
 * Intended for controllers that do not perform
 * asynchronous operations.
 */
export type ControllerFunc =
    (req: Request, res: Response) => Response;

/**
 * Asynchronous Express controller function.
 *
 * @remarks
 * Intended for controllers that perform asynchronous
 * operations and return a resolved {@link Response}.
 */
export type ControllerAsyncFunc =
    (req: Request, res: Response) => Promise<Response>;
