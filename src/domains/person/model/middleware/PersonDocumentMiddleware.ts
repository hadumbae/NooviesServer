import type {HydratedDocument} from "mongoose";
import type {IPerson} from "../IPerson.js";
import MovieCredit from "../../../movieCredit/models/MovieCredit.js";

export async function DeletePersonDocumentPreMiddleware(this: HydratedDocument<IPerson>) {
    const {_id} = this;
    if (!_id) return;

    await MovieCredit.deleteMany({person: _id});
}