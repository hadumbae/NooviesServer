import {Reservation, type ReservationSchemaFields} from "@/domains/reservations/_model/reservation";
import {ReservationQueryMatchStageSchema, ReservationQuerySortStageSchema} from "@/domains/reservations/_feat/validate-query-options";
import {buildAuthCRUDQueryMiddleware} from "@/shared/_feat/middleware";
import {destroy, findById, findBySlug} from "@/shared/_feat/generic-crud/path-handlers";
import {buildCRUDRoutes, type CRUDRoute} from "@/shared/_feat/generic-crud/routes";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import type {Router} from "express";
import {ReservationPopulatePaths} from "@/domains/reservations/_feat/query-population";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {aggregate} from "@/shared/_feat/generic-aggregate";

const modelName = Reservation.modelName;
const matchSchema = ReservationQueryMatchStageSchema;
const sortSchema = ReservationQuerySortStageSchema;

const routes: CRUDRoute<ReservationSchemaFields>[] = [
    {
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        path: `/item/:slug/slug`,
        method: "get",
        middleware: [isAuth],
        handler: findBySlug
    },
    {
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

const router: Router = buildCRUDRoutes<ReservationSchemaFields>({
    model: Reservation,
    routes: routes,
    populatePaths: ReservationPopulatePaths,
});

router.get(
    "/query",
    buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
    asyncHandler(aggregate({model: Reservation})),
);

export {
    router as ReservationCRUDRoutes,
};