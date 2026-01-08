import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://srivastavswapnil012:KRGk5HagpVr08qcb@mernbookstore.a53jikn.mongodb.net/')
        .then(() => console.log("DB CONNECTED"));
}

