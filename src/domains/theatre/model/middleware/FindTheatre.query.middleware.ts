import type {Query} from "mongoose";
import type ITheatre from "../ITheatre.js";

export function FindQueryPre(this: Query<any, ITheatre>, next: () => void): void {
    const currentDate = new Date();
    const hasVirtuals = typeof this._mongooseOptions.lean === "object" && this._mongooseOptions.lean.virtuals === true;

    if (hasVirtuals) {
        this.populate([
            {
                path: "screenCount",
            },
            {
                path: "seatCount",
            },
            {
                path: "futureShowingCount",
                match: {startTime: {$gte: currentDate}},
            },
        ]);
    }

    next();
}