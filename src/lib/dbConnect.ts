import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number
}

const connection : connectionObject = {}; // connection can be empty as isConnected? is optional, if we remove ?, it will show error

async function dbConnect() : Promise<void> { // in TS, void is different from cpp/java, here it means that we don't care what type of data we return.
    if(connection.isConnected){ 
        console.log("already connnected to database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully");

    } catch (error) {
        console.log("Database connection failed");
        process.exit(1);
    }
}
export default dbConnect;
