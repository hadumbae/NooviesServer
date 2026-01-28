import {ReservationLifecycleService} from "../services/lifecycle/ReservationLifecycleService.js";
import ReservationSchema from "../model/reservation/Reservation.schema.js";

export class ReservationServiceProvider {
    static registerMiddleware() {
        const lifecycleService = new ReservationLifecycleService();
        lifecycleService.registerHooks(ReservationSchema);
    }
}