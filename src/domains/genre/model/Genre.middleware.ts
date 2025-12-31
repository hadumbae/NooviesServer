import GenreSchema from "./Genre.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import MovieModel from "../../movie/model/Movie.model.js";
import type {GenreSchemaFields} from "./Genre.types.js";
import generateSlug from "../../../shared/utility/generateSlug.js";
import getUpdateData from "../../../shared/utility/mongoose/getUpdateData.js";

/**
 * Automatically regenerates the slug when the genre name changes.
 */
GenreSchema.pre(
    "validate",
    {document: true},
    function (this: HydratedDocument<GenreSchemaFields>, next: () => void) {
        console.log("Is Name Modified? ", this.isModified("name"));

        if (this.isModified("name")) {
            this.slug = generateSlug(this.name);
            console.log("Slug:  ", this.slug);
        }

        next();
    },
);

/**
 * Regenerates the slug when updating the genre name via queries.
 */
GenreSchema.pre(
    "findOneAndUpdate",
    {query: true},
    function (this: Query<any, GenreSchemaFields>, next: () => void) {
        const update = getUpdateData(this.getUpdate());

        if (update.name) {
            update.slug = generateSlug(update.name);
        }

        next();
    }
);

/**
 * Populates virtual fields when lean queries request virtuals.
 */
GenreSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {query: true},
    function (this: Query<any, GenreSchemaFields>, next: () => void): void {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            this.populate([{path: "movieCount"}]);
        }

        next();
    }
);

/**
 * Removes this genre reference from all movies before deletion.
 */
GenreSchema.pre(
    "deleteOne",
    {document: true, query: false},
    async function (this: HydratedDocument<GenreSchemaFields>) {
        const {_id} = this;
        await MovieModel.updateMany({$pull: {genres: _id}}).exec();
    }
);

/**
 * Deletes all movies associated with the genre when removed via queries.
 */
GenreSchema.pre(
    ["deleteOne", "deleteMany"],
    {document: false, query: true},
    async function (this: Query<any, GenreSchemaFields>) {
        const {_id} = this.getFilter();
        if (!_id) return;

        await MovieModel.deleteMany({genre: _id}).exec();
    }
);
