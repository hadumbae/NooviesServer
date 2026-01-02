import 'dotenv/config';

import connect from "@config/database.js";
import Screen from "../domains/screen/model/Screen.model.js";
import generateSlug from "../shared/utility/generateSlug.js";
import process from "node:process";

connect().then(async () => {
    const cursor = Screen.find().cursor();

    for (let screen = await cursor.next(); screen != null; screen = await cursor.next()) {
        if (!screen.slug) {
            screen.slug = generateSlug(screen.name);
            await screen.save();
        }
    }

    await Screen.createIndexes();
    console.log("Done updating seats.");

    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});