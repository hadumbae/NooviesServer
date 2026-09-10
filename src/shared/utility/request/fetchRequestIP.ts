/**
 * @fileoverview Utility for retrieving the client IP address from an Express request with optional environment-based mocking.
 */

import "dotenv/config";
import type {Request} from "express";

/**
 * Returns the client IP address for the incoming request, falling back to a mocked IP if enabled in environment variables.
 */
export function fetchRequestIP(req: Request): string | undefined {
    return process.env.USE_MOCKED_IP ? process.env.MOCKED_CLIENT_IP : req.ip;
}