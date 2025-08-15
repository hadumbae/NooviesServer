import {PersonSchema} from "./Person.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

PersonSchema.virtual("creditCount", {
    ref: "MovieCredit",
    localField: "_id",
    foreignField: "person",
    count: true,
});

PersonSchema.virtual("credits", {
    ref: "MovieCredit",
    localField: "_id",
    foreignField: "person",
    justOne: false,
});

PersonSchema.virtual("movieCount", {
    ref: "Movie",
    localField: "credits.movie",
    foreignField: "_id",
    count: true,
});

PersonSchema.plugin(mongooseLeanVirtuals);