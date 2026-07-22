/**
 * @fileoverview Defines virtual fields for the SeatMap schema to handle pricing and seat property delegation.
 */

import {SeatMapSchema} from "@/domains/seatmap/_model/seat-map/SeatMap.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import type {SeatSchemaFields} from "@/domains/seat/_models";

SeatMapSchema.virtual("finalPrice").get(function () {
    if (this.overridePrice) {
        return this.overridePrice;
    }

    return this.basePrice * this.priceMultiplier;
});

SeatMapSchema.virtual("x").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).x;
    }

    return undefined;
});

SeatMapSchema.virtual("y").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).y;
    }

    return undefined;
});

SeatMapSchema.virtual("row").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).row;
    }

    return undefined;
});

SeatMapSchema.virtual("seatLabel").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).seatLabel ?? undefined;
    }

    return undefined;
});

SeatMapSchema.plugin(mongooseLeanVirtuals);
