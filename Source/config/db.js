import mongoose from "mongoose";

export const connectDB = async()=> {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connection successful!");
    }catch(error){
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};