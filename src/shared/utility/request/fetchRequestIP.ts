/**
 * @file Utility for retrieving the client IP address from a request.
 * Supports optional environment-based mocking for development/testing.
 * @filename fetchRequestIP.ts
 */

import "dotenv/config";
import type {Request} from "express";

/**
 * Returns the client IP address for the incoming request.
 *
 * If `USE_MOCKED_IP` is enabled, the mocked IP from `MOCKED_CLIENT_IP`
 * is returned instead of the request IP.
 *
 * @param req - Express request object.
 * @returns Client IP address.
 */
export function fetchRequestIP(req: Request): string | undefined {
    return process.env.USE_MOCKED_IP ? process.env.MOCKED_CLIENT_IP : req.ip;
}