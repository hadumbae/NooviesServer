import Theatre from "../../../theatre/model/Theatre.js";
import type {IScreen} from "../../interface/IScreen.js";
import Seat from "../../../seat/model/Seat.js";
import type {HydratedDocument} from "mongoose";
import Showing from "../../../showing/model/Showing.js";

export async function SaveScreenDocumentPreMiddleware(this: HydratedDocument<IScreen>) {
    (this as any)._wasNew = this.isNew;
}

export async function SaveScreenDocumentPostMiddleware(this: HydratedDocument<IScreen>) {
    if (!(this as any)._wasNew) return;
    (this as any)._wasUpdated = true;

    await Theatre.updateOne({_id: this._id}, {$push: {screens: this}});
}

export async function DeleteOneScreenDocumentPostMiddleware(this: HydratedDocument<IScreen>) {
    (this as any)._wasUpdated = true;

    await Promise.all([
        Theatre.updateMany({screens: this._id}, {$pull: {screens: this._id}}),
        Seat.deleteMany({screen: this._id}),
        Showing.deleteMany({screen: this._id}),
    ]);

}

