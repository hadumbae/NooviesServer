/**
 * @fileoverview Mongoose middleware for the Showing model lifecycle to handle data synchronization and soft-delete filtering.
 */

import {ShowingSchema} from "./Showing.schema.js";
import {type HydratedDocument, type Query} from "mongoose";
import type {ShowingSchemaFields} from "./Showing.types.js";
import {fetchRequiredModelDocument} from "@/shared/utility/fetch/fetchRequiredModelDocument";
import {Theatre} from "@/domains/theatre/model/theatre";
import type {ScreenSchemaFields} from "@/domains/screen/models/screen";
import {ShowingVirtualPopulationPaths} from "@/domains/showing/_feat/query-population";
import {createShowingSeatMap} from "@/domains/seatmap/_feat/manage-showing-seat-maps";
import {ShowingSeatMapVirtualPipelines} from "@/domains/showing/queries/ShowingSeatMapVirtualPipelines";
import SeatMap from "@/domains/seatmap/model/SeatMap.model";
import {Movie} from "@/domains/movies/_models/movie";
import generateSlug from "@/shared/utility/generateSlug";

ShowingSchema.pre("validate", {document: true}, async function () {
    if (this.isModified("theatre")) {
        const theatre = await fetchRequiredModelDocument({
            model: Theatre,
            _id: this.theatre,
            notFoundMessage: "Theatre Not Found.",
        });

        this.location = theatre.location;
    }

    if (this.isModified("movie")) {
        const movie = await fetchRequiredModelDocument({
            model: Movie,
            _id: this.movie,
            notFoundMessage: "Movie Not Found.",
        });

        this.slug = generateSlug(movie.title);
    }
});

ShowingSchema.pre("save", {document: true}, function () {
    (this as any)._wasNew = this.isNew;
});

ShowingSchema.post("save", {document: true}, async function (doc: HydratedDocument<ShowingSchemaFields>) {
    if (!doc._id) return;
    if ((doc as any)._wasNew) await createShowingSeatMap({showingID: doc._id});
});

ShowingSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {document: false, query: true},
    function (this: Query<any, ScreenSchemaFields>, next: () => void) {
        if (!this.mongooseOptions().getSoftDeleted) {
            this.where({isDeleted: false, deletedAt: null});
        }

        const leanOption = this._mongooseOptions.lean;
        const hasVirtuals = (typeof leanOption === "object" && leanOption.virtuals === true) || leanOption === true;

        if (hasVirtuals) {
            this.populate(ShowingVirtualPopulationPaths);
        }

        next();
    },
);

ShowingSchema.pre("aggregate", async function () {
    const {virtuals} = this.options as { virtuals: boolean };
    if (virtuals) this.pipeline().push(...ShowingSeatMapVirtualPipelines);
});

ShowingSchema.post(["deleteOne", "deleteMany"], {document: false, query: true}, async function () {
    const {_id: showingID} = this.getFilter();
    if (showingID) await SeatMap.deleteMany({showing: showingID});
});

ShowingSchema.post(
    "deleteOne",
    {document: true, query: false},
    async function (doc: HydratedDocument<ShowingSchemaFields>) {
        if (!doc._id) return;
        await SeatMap.deleteMany({showing: doc._id});
    }
);