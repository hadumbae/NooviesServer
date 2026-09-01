/**
 * @fileoverview Express controller for fetching aggregated admin dashboard analytics data.
 */

import type {Request, Response} from "express";
import {fetchAdminDashboardData} from "@/domains/dashboard/_feat/load-data";

/** Express request handler that retrieves and returns aggregated metrics for the admin dashboard. */
export async function getFetchAdminDashboardData(req: Request, res: Response): Promise<Response> {
    const data = await fetchAdminDashboardData();
    return res.status(200).json(data);
}