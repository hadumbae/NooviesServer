import type SeatMapService from "../../../seatmap/service/seat-map-service/SeatMapService.js";
import {type HydratedDocument, type Query, Schema} from "mongoose";
import type IShowing from "../../model/IShowing.js";
import SeatMap from "../../../seatmap/model/SeatMap.model.js";

type ShowingLifestyleServiceConstructor = {
    /** Service responsible for creating seat maps for new showings. */
    seatMapService: SeatMapService;
};

/**
 * Registers lifecycle hooks for the Showing model.
 *
 * Responsibilities:
 * - Create a seat map whenever a showing is newly inserted.
 * - Populate seat-related virtuals when lean queries request them.
 * - Cascade-delete related seat maps when a showing is removed.
 */
export default class ShowingLifestyleService {
    private seatMapService: SeatMapService;

    /**
     * @param params - Dependencies for hook behavior.
     */
    constructor(params: ShowingLifestyleServiceConstructor) {
        const {seatMapService} = params;
        this.seatMapService = seatMapService;
    }

    /**
     * Marks whether the document is newly created
     * so the post-save hook can detect new insertions.
     */
    private handlePreSave = async (doc: HydratedDocument<IShowing>) => {
        (doc as any)._wasNew = doc.isNew;
    };

    /**
     * Creates a seat map for a newly inserted showing.
     */
    private handlePostSave = async (doc: HydratedDocument<IShowing>) => {
        const {_id} = doc;
        if (!_id) return;

        if ((doc as any)._wasNew) {
            await this.seatMapService.createShowingSeatMap({showingID: _id});
        }
    };

    /**
     * Automatically populates seat-related virtuals
     * when lean queries request them with `virtuals: true`.
     */
    private handlePreSaveQuery = async (query: Query<any, IShowing>) => {
        const hasVirtuals =
            typeof query._mongooseOptions.lean === "object" &&
            query._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            query.populate([
                {path: "seatMapCount"},
                {path: "availableSeatsCount"},
                {path: "reservedSeatsCount"},
                {path: "unreservedSeatsCount"},
            ]);
        }
    };

    /**
     * Cascades deletion of seat maps when a showing document is deleted.
     */
    private handlePostDeleteDocument = async (doc: HydratedDocument<IShowing>) => {
        const {_id} = doc;
        if (!_id) return;

        await SeatMap.deleteMany({showing: _id});
    };

    /**
     * Cascades deletion of seat maps when a showing is removed via a query.
     */
    private handlePostDeleteQuery = async (query: Query<any, IShowing>) => {
        const {_id: showingID} = query.getFilter();
        await SeatMap.deleteMany({showing: showingID});
    };

    /**
     * Registers all lifecycle hooks on the given schema.
     *
     * @param schema - The Showing schema to attach hooks to.
     */
    public registerHooks(schema: Schema) {
        // --- Create Seat Map ---
        schema.pre("save", {document: true, query: false}, this.handlePreSave as any);
        schema.post("save", {document: true, query: false}, this.handlePostSave);

        // --- Populate For Virtuals ---
        schema.pre(["find", "findOne", "findOneAndUpdate"], {document: false, query: true}, this.handlePreSaveQuery as any);

        // --- Delete Related Seat Map ---
        schema.post("deleteOne", {document: true, query: false}, this.handlePostDeleteDocument);
        schema.post(["deleteOne", "deleteMany"], {document: false, query: true}, this.handlePostDeleteQuery);
    }
}
