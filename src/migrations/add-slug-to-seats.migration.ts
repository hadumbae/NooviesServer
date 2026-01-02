import 'dotenv/config';

import connect from "@config/database.js";
import Seat from "../domains/seat/model/Seat.model.js";
import generateSlug from "../shared/utility/generateSlug.js";
import process from "node:process";

connect().then(async () => {
    const cursor = Seat.find().cursor();

    for (let seat = await cursor.next(); seat !== null; seat = await cursor.next()) {
        if (!seat.slug) {
            seat.slug = generateSlug(seat.layoutType);
            await seat.save();
        }
    }

    await Seat.createIndexes();
    console.log("Done updating seats.");

    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});