import "dotenv/config";
import mongoose from "mongoose";
import {connect} from "@/shared/config/database.js";
import {User} from "@/domains/users";

connect()
    .then(async () => {

        const cursor = User.find().cursor();

        for (let user = await cursor.next(); user !== null; user = await cursor.next()) {
            user.status = "ACTIVE";
            await user.save();

            console.log(`Updated User Status: ${user._id}`);
        }
    })
    .catch((err) => console.error(err))
    .finally(async () => await mongoose.disconnect());
