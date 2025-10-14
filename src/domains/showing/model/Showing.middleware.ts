import {ShowingSchema} from "./Showing.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import type IShowing from "./IShowing.js";
import SeatMapService from "../../seatmap/service/SeatMapService.js";
import SeatMap from "../../seatmap/model/SeatMap.js";

/**
 * @fileoverview
 * Defines lifecycle middleware for the `Showing` Mongoose schema.
 *
 * @description
 * These middleware hooks handle side effects when a `Showing` document
 * is created, updated, or deleted. Their responsibilities include:
 *
 * - Automatically generating a seat map when a new showing is created.
 * - Cleaning up related seat maps when a showing is deleted.
 *
 * Middleware are registered directly on the `ShowingSchema`.
 *
 * ---
 *
 * ### Middleware Overview
 * - **pre("save")** — Marks if the document was newly created.
 * - **post("save")** — Creates a seat map when a new showing is saved.
 * - **post("deleteOne", document: true)** — Removes seat maps for the deleted showing.
 * - **post("deleteOne" / "deleteMany", query: true)** — Removes seat maps based on query deletion.
 */

/**
 * Marks whether a `Showing` document is newly created before saving.
 *
 * @remarks
 * Sets an internal flag `_wasNew` on the document so later middleware
 * can determine if the save operation represents an insert.
 */
ShowingSchema.pre("save", { document: true, query: false }, async function (this: HydratedDocument<IShowing>) {
    (this as any)._wasNew = this.isNew;
});

/**
 * After saving a `Showing`, automatically creates a corresponding seat map
 * if the document was newly created.
 *
 * @remarks
 * This ensures that every new showing has an associated seat map record.
 */
ShowingSchema.post("save", { document: true, query: false }, async function (this: HydratedDocument<IShowing>) {
    const { _id } = this;
    if (!_id) return;

    if ((this as any)._wasNew) {
        const service = new SeatMapService();
        await service.createShowingSeatMap({ showingID: this._id.toString() });
    }
});

/**
 * After deleting a `Showing` via a document instance,
 * removes all related seat maps linked to that showing.
 *
 * @remarks
 * This cleanup ensures no orphaned seat maps remain in the database.
 */
ShowingSchema.post("deleteOne", { document: true, query: false }, async function (this: HydratedDocument<IShowing>) {
    const { _id } = this;
    if (!_id) return;

    await SeatMap.deleteMany({ showing: this._id });
});

/**
 * After deleting `Showing` documents via a query (`deleteOne` or `deleteMany`),
 * removes any seat maps associated with the deleted showings.
 *
 * @remarks
 * This applies to bulk deletions or query-based removals.
 */
ShowingSchema.post(["deleteOne", "deleteMany"], { document: false, query: true }, async function (this: Query<any, IShowing>) {
    const { _id: showingID } = this.getFilter();
    await SeatMap.deleteMany({ showing: showingID });
});
