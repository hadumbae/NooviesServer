import {PersonSchema} from "./Person.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import type {IPerson} from "../interfaces/IPerson.js";
import MovieCredit from "../../movieCredit/models/MovieCredit.js";

PersonSchema.pre(["find", "findOne", "findOneAndUpdate"], {query: true}, function (
    this: Query<any, IPerson>, next: () => void
) {
    const hasVirtuals = typeof this._mongooseOptions.lean === "object" && this._mongooseOptions.lean.virtuals === true;

    console.log("Has Virtuals: ", hasVirtuals);

    if (hasVirtuals) {
        console.log("Populating...");

        this.populate([
            {path: "credits", populate: {path: "movie"}},
            {path: "movieCount"},
            {path: "creditCount"},
        ]);
    }

    next();
});

PersonSchema.pre("deleteOne", {query: false, document: true}, async function (
    this: HydratedDocument<IPerson>
) {
    const {_id} = this;
    if (!_id) return;

    await MovieCredit.deleteMany({person: _id});
});

PersonSchema.pre(["deleteOne", "deleteMany"], {query: true, document: false}, async function (
    this: Query<any, IPerson>
) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await MovieCredit.deleteMany({movie: _id});
});