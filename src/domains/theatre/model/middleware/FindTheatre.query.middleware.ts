import type {Query} from "mongoose";
import type ITheatre from "../ITheatre.js";

export function FindQueryPre(this: Query<any, ITheatre>, next: () => void): void {
    const hasVirtuals = typeof this._mongooseOptions.lean === "object" && this._mongooseOptions.lean.virtuals === true;

    if (hasVirtuals) {
        this.populate([
            {
                path: "showings",
                populate: [
                    {path: "movie", model: "Movie"},
                    {path: "screen", model: "Screen"},
                ],
            },
            {
                path: "screens",
                options: {lean: {virtuals: true}},
                populate: {
                    path: "seats",
                    model: "Seat",
                }
            }
        ]);
    }

    next();
}