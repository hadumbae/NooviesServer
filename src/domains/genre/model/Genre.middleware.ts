import GenreSchema from "./Genre.schema.js";
import type IGenre from "./Genre.interface.js";
import type {HydratedDocument, Query} from "mongoose";
import Movie from "../../movie/model/Movie.js";

GenreSchema.pre(["find", "findOne", "findOneAndUpdate"], {query: true}, function (this: Query<any, IGenre>, next: () => void): void {
    const hasVirtuals = typeof this._mongooseOptions.lean === "object" && this._mongooseOptions.lean.virtuals === true;

    if (hasVirtuals) {
        this.populate([
            {path: "movieCount"},
        ]);
    }

    next();
});

GenreSchema.pre("deleteOne", {document: true, query: false}, async function (this: HydratedDocument<IGenre>) {
    const {_id} = this;
    await Movie.updateMany({$pull: {genres: _id}}).exec();
});

GenreSchema.pre(["deleteOne", "deleteMany"], {document: false, query: true}, async function (this: Query<any, IGenre>) {
    const {_id} = this.getFilter();
    if (!_id) return;

    await Movie.deleteMany({genre: _id}).exec();
});
