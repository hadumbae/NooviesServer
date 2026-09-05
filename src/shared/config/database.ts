/**
 * @fileoverview Database connection utility for establishing and managing MongoDB connections using Mongoose.
 */

import mongoose from "mongoose";
let isConnected = false;

/** Establishes a connection to the MongoDB database using environment configuration. */
export const connect = async () => {
    if (isConnected) {
        console.log("Already connected to MongoDB.");
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_STRING!);

        isConnected = true;
        console.log("Database Connection Succeeded.");

        return connection;
    } catch (e: any) {
        isConnected = false;
        console.error("Database Connection Failed", e.message);
    }
}