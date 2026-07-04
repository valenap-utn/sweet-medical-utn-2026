import mongoose from "mongoose";

export class MongoDBClient {
    static async connectDB() {
        try{
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`Connected to MongoDB: ${conn.connection.host}`);
        }catch (e) {
            console.error(`Error: ${e.message}`);
            process.exit(1);
        }
    }
}