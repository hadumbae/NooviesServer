import type {Query} from "mongoose";
import type {IScreen} from "../../interface/IScreen.js";

export async function FindQueryPre(this: Query<any, IScreen>, next: () => void) {
    const currentDate = new Date();
    const hasVirtuals = typeof this._mongooseOptions.lean === "object" && this._mongooseOptions.lean.virtuals === true;

    if (hasVirtuals) {
        this.populate([
            {
                path: "seatCount"
            },
            {
                path: "futureShowingCount",
                match: {startTime: {$gte: currentDate}}
            },
        ]);
    }

    next();
}