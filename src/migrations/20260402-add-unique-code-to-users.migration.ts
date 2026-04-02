/**
 * @file Migration script to backfill unique identification codes for existing user documents.
 * @filename 20260402-add-unique-code-to-users.migration.ts
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import User from "@models/User.model";
import {generateUserUniqueCode} from "@domains/users/utilities";

/**
 * Execution block for the User data migration.
 */
connect().then(async () => {
    /** Initialize cursor for memory-efficient document processing. */
    const cursor = User.find().cursor();

    for (let user = await cursor.next(); user !== null; user = await cursor.next()) {
        console.log("Found User!")

        user.uniqueCode = user.uniqueCode ? user.uniqueCode : generateUserUniqueCode();

        await user.save();

        console.log("User: ", user.name);
        console.log("Unique Code: ", user.uniqueCode);
    }

    await User.syncIndexes();
    console.log("Done updating users. Added unique codes.");
}).catch((err) => {
    console.error("Migration Error: ", err);
}).finally(async () => {
    await mongoose.disconnect();
    console.log("Mongoose Disconnected.");
});