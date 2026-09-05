/**
 * @fileoverview Migration script for populating showing timezones from their parent theatre locations.
 */

import "dotenv/config";
import mongoose from "mongoose";
import {connect} from "@/shared/config/database.js";
import {Showing} from "@/domains/showing";
import {Theatre} from "@/domains/theatre/model/theatre";

connect().then(async () => {

    const cursor = Showing.find().cursor();

    for (let showing = await cursor.next(); showing !== null; showing = await cursor.next()) {
        const theatre = await Theatre.findById(showing.theatre);
        if (!theatre) continue;

        showing.timezone = theatre.location.timezone;
        await showing.save();

        console.log(`Updated Showing Timezone: ${showing._id}`);
        console.log(`New Timezone: ${showing.timezone} • ${theatre.location.timezone}`);
    }
}).catch((err) => console.error(err)).finally(async () => await mongoose.disconnect());