import {ShowingSchema} from "./Showing.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import type IShowing from "./IShowing.js";
import SeatMapService from "../../seatmap/service/SeatMapService.js";
import SeatMap from "../../seatmap/model/SeatMap.model.js";

/**
 * @fileoverview
 * Registers Mongoose middleware for the `Showing` model to automate
 * seat map management and cleanup.
 *
 * @description
 * This module attaches lifecycle hooks to the `ShowingSchema` to:
 *
 * - Generate seat maps when a new showing is created.
 * - Remove seat maps when a showing is deleted.
 * - Populate virtual counts when performing `find` queries with lean mode.
 *
 * ---
 * ### Hook Summary
 * | Hook Type | Stage | Responsibility |
 * |------------|--------|----------------|
 * | `pre("find")`, `pre("findOne")`, `pre("findOneAndUpdate")` | Query | Auto-populate virtual seat counts if lean virtuals are enabled. |
 * | `pre("save")` | Document | Mark document as newly created before saving. |
 * | `post("save")` | Document | Create a seat map if this is a newly inserted showing. |
 * | `post("deleteOne", {document:true})` | Document | Delete seat maps belonging to the removed showing. |
 * | `post("deleteOne" / "deleteMany", {query:true})` | Query | Remove seat maps belonging to showings deleted via query. |
 */

/**
 * Auto-populate virtual seat count fields when using `.lean({ virtuals: true })`
 * on queries such as `find`, `findOne`, and `findOneAndUpdate`.
 *
 * @param this - The active Mongoose query instance for a `Showing` model.
 */
ShowingSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {query: true},
    async function (this: Query<any, IShowing>) {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            this.populate([
                {path: "seatMapCount"},
                {path: "availableSeatsCount"},
                {path: "reservedSeatsCount"},
                {path: "unreservedSeatsCount"},
            ]);
        }
    },
);

/**
 * Marks a `Showing` as newly created before saving.
 *
 * @remarks
 * Sets a private flag `_wasNew` so later middleware can detect
 * whether the current save represents an insert rather than an update.
 *
 * @param this - The hydrated `Showing` document being saved.
 */
ShowingSchema.pre(
    "save",
    {document: true, query: false},
    async function (this: HydratedDocument<IShowing>) {
        (this as any)._wasNew = this.isNew;
    },
);

/**
 * Automatically creates a seat map after a new `Showing` is saved.
 *
 * @remarks
 * Only runs if the document was newly created, ensuring every
 * `Showing` has a corresponding seat map entry.
 *
 * @param this - The saved `Showing` document.
 */
ShowingSchema.post(
    "save",
    {document: true, query: false},
    async function (this: HydratedDocument<IShowing>) {
        const {_id} = this;
        if (!_id) return;

        if ((this as any)._wasNew) {
            const service = new SeatMapService();
            await service.createShowingSeatMap({showingID: _id.toString()});
        }
    },
);

/**
 * Deletes seat maps linked to a deleted `Showing` document.
 *
 * @remarks
 * Triggered when `.deleteOne()` is called directly on a document instance.
 * Ensures that no orphaned seat maps remain.
 *
 * @param this - The deleted `Showing` document instance.
 */
ShowingSchema.post(
    "deleteOne",
    {document: true, query: false},
    async function (this: HydratedDocument<IShowing>) {
        const {_id} = this;
        if (!_id) return;

        await SeatMap.deleteMany({showing: _id});
    },
);

/**
 * Removes seat maps associated with showings deleted via query operations.
 *
 * @remarks
 * This cleanup applies to bulk deletions such as `deleteMany()` or
 * query-based `deleteOne()`. It inspects the query filter to identify
 * affected showings.
 *
 * @param this - The query object representing a delete operation.
 */
ShowingSchema.post(
    ["deleteOne", "deleteMany"],
    {document: false, query: true,},
    async function (this: Query<any, IShowing>) {
        const {_id: showingID} = this.getFilter();
        await SeatMap.deleteMany({showing: showingID});
    },
);
