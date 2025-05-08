import 'dotenv/config';
import mongoose from "mongoose";
import User from "../domains/users/model/User.js";

const addFavouritesMigration = async () => {
    await mongoose.connect(process.env.MONGO_DB_STRING!);

    const res = await User.updateMany(
        {favourites: {$exists: false}},
        {$set: {favourites: []}},
    );

    console.log("Modified.");
    console.log("Users Matched : ", res.matchedCount);
    console.log("Users Modified : ", res.modifiedCount);

    await mongoose.disconnect();
};

addFavouritesMigration()
    .catch(err => console.error(err));