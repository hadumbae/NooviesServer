/**
 * @fileoverview Defines Mongoose virtual fields for the User model to aggregate related data.
 */

import {UserSchema} from "@/domains/users/model/user/User.schema";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

UserSchema.virtual("reviewCount", {
    ref: "MovieReview",
    localField: "_id",
    foreignField: "user",
    count: true,
});

UserSchema.virtual("reservationCount", {
    ref: "Reservation",
    localField: "_id",
    foreignField: "user",
    count: true,
});

UserSchema.virtual("activeReservationCount", {
    ref: "Reservation",
    localField: "_id",
    foreignField: "user",
    match: {status: {$in: ["PENDING", "PAID"]}},
    count: true,
});

UserSchema.plugin(mongooseLeanVirtuals);