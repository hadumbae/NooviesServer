import Theatre from "../../theatre/model/Theatre.js";
import type {IScreen} from "./IScreen.js";
import Seat from "../../seat/model/Seat.js";
import type {Query} from "mongoose";
import Showing from "../../showing/model/Showing.js";

/**
 * Document Middleware
 */

// Save
export async function SaveScreenDocumentPostMiddleware(this: IScreen) {
    await Theatre.bulkWrite([
        {updateMany: {filter: {}, update: {movies: {$pull: this._id}}}},
        {updateOne: {filter: {_id: {$in: this._id}}, update: {movies: {$push: this}}}},
    ]);
}

// Delete
export async function DeleteOneScreenDocumentPostMiddleware(this: IScreen) {
    await Theatre.updateMany({}, {$pull: {screens: this._id}});
    await Seat.deleteMany({screen: this._id});
    await Showing.deleteMany({screen: this._id});
}

/**
 * Query Middleware
 */

// Delete
export async function DeleteScreenQueryPostMiddleware(this: Query<any, IScreen>) {
    const {_id} = this.getFilter();
    await Theatre.updateMany({}, {$pull: {screens: _id}});
    await Seat.deleteMany({screen: _id});
    await Showing.deleteMany({screen: _id});
}