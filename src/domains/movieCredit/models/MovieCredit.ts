import {model, type Model, Schema} from "mongoose";
import type {IMovieCredit} from "./IMovieCredit.js";
import RoleTypeConstant from "../constants/RoleTypeConstant.js";

const MovieCreditSchema = new Schema<IMovieCredit>({
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: [true, "Required."],
    },

    person: {
        type: Schema.Types.ObjectId,
        ref: "Person",
        required: [true, "Required."],
    },

    roleType: {
        type: String,
        required: true,
        enum: RoleTypeConstant
    },

    notes: {
        type: String,
        maxlength: [1000, "Notes must be 1000 characters or less."],
    },

    // Crew

    job: {
        type: String,
        maxlength: [150, "Must be 500 characters or less."],
        required: function () {
            return this.roleType === "CREW";
        },
    },

    // Cast

    characterName: {
        type: String,
        maxlength: [150, "Must be 150 characters or less."],
        required: function () {
            return this.roleType === "CAST";
        }
    },

    billingOrder: {
        type: Number,
        min: [1, "Must be 1 or more."],
        required: function () {
            return this.roleType === "CAST";
        }
    },

    // Boolean Flags

    uncredited: {
        type: Boolean,
        default: false,
    },

    voiceOnly: {
        type: Boolean,
        default: false,
    },

    cameo: {
        type: Boolean,
        default: false,
    },

    motionCapture: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

const MovieCredit: Model<IMovieCredit> = model<IMovieCredit>("MovieCredit", MovieCreditSchema);
export default MovieCredit