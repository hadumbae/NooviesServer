/**
 * @fileoverview Migration script that updates reservation documents to include movie references from their associated showings.
 */

import "dotenv/config";
import mongoose from "mongoose";
import connect from "@/shared/config/database.js";
import {Reservation} from "@/domains/reservations";
import type {ShowingSchemaFields} from "@/domains/showing";

connect()
    .then(async () => {

        const cursor = Reservation.find().cursor();

        for (let reservation = await cursor.next(); reservation !== null; reservation = await cursor.next()) {
            const populated = await reservation.populate({path: "showing"});

            populated.movie = (populated.showing as unknown as ShowingSchemaFields).movie;

            await populated.save();

            console.log(`Updated Reservation: ${reservation._id}`);
            console.log(`Updated: ${reservation}`);
        }
    })
    .catch((err) => console.error(err))
    .finally(async () => await mongoose.disconnect());
