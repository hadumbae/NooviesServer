import {Router} from "express";
import {isAdmin, isAuth} from "@/domains/authentication";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {getFetchAdminDashboardData} from "@/domains/dashboard/_feat/routing/getFetchAdminDashboardData";

const router = Router();

router.get("/dashboard-data", [isAuth, isAdmin], asyncHandler(getFetchAdminDashboardData));

export {
    router as AdminDashboardRoutes
}