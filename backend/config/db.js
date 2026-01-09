import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('"Enter Link here"')
        .then(() => console.log("DB CONNECTED"));
}

