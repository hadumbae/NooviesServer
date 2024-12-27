import {Schema, Types, Model, model} from "mongoose";

export interface IUser {
    readonly _id: Types.ObjectId | string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

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
    }
}, {timestamps: true});

const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;