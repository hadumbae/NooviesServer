import {Model, model, Schema} from "mongoose";
import type IUser from "./IUser.js";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required."],
    },

    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "Email must be unique."],
    },

    password: {
        type: String,
        required: [true, "Password is required."],
        minLength: [16, "Password must be at least 16 characters."],
    },

    isAdmin: {
        type: Boolean,
        required: [true, "IsAdmin is required."],
        default: false,
    },

    favourites: [{
        type: Schema.Types.ObjectId,
        ref: "Movie",
    }],
}, {timestamps: true});

const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;