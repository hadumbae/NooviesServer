import {model, type Model, Schema} from "mongoose";
import type {IPerson} from "./IPerson.js";

import {DeletePersonQueryPreMiddleware} from "./middleware/PersonQueryMiddleware.js";
import {DeletePersonDocumentPreMiddleware} from "./middleware/PersonDocumentMiddleware.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import {CloudinaryImageSchema} from "../../../shared/model/CloudinaryImage.js";

// TODO Add Awards and Nominations

const PersonSchema = new Schema<IPerson>({
    name: {
        type: String,
        required: [true, "Name is required."],
        minlength: [3, "Name must be 3 or more characters."],
        maxlength: [255, "Name must be 255 characters or less."],
    },

    biography: {
        type: String,
        required: [true, "Biography is required."],
        maxlength: [2000, "Name must be 2000 characters or less."],
    },

    dob: {
        type: String,
        required: [true, "Date Of Birth is required."],
        match: [/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format."]
    },

    nationality: {
        type: String,
        required: [true, "Nationality is required."],
        default: null,
    },

    profileImage: {
        type: CloudinaryImageSchema,
        required: false,
        default: null,
    },
}, {timestamps: true});

/**
 * Middleware
 */

PersonSchema.pre("deleteOne", {query: false, document: true}, DeletePersonDocumentPreMiddleware);
PersonSchema.pre(["deleteOne", "deleteMany"], {query: true, document: false}, DeletePersonQueryPreMiddleware);

/**
 * Virtuals
 */

PersonSchema.virtual("movies", {ref: "MovieCredit", localField: "_id", foreignField: "person", justOne: false});

PersonSchema.plugin(mongooseLeanVirtuals);

const Person: Model<IPerson> = model<IPerson>("Person", PersonSchema);
export default Person;