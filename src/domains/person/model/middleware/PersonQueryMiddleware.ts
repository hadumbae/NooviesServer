import type {Query} from "mongoose";
import type {IPerson} from "../IPerson.js";
import MovieCredit from "../../../movieCredit/models/MovieCredit.js";

export async function DeletePersonQueryPreMiddleware(this: Query<any, IPerson>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await MovieCredit.deleteMany({movie: _id});
}