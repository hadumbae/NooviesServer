import 'dotenv/config';

import connect from "@config/database.js";
import Theatre from "../domains/theatre/model/Theatre.model.js";
import generateSlug from "../shared/utility/generateSlug.js";
import * as process from "node:process";

connect().then(async () => {
    const cursor = Theatre.find().cursor();

    for (let theatre = await cursor.next(); theatre !== null; theatre = await cursor.next()) {
        if (!theatre.slug) {
            theatre.slug = generateSlug(theatre.name);
            await theatre.save();
        }
    }

    await Theatre.createIndexes();
    console.log("Done updating theatres.");

    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});