import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async (retries = 2): Promise<any> => {

    if (isConnected) {
        console.log('MongoDB is aready connected');
        return true;
    }

    try {
        const uri = process.env.MONGODB_URI as string;
        const options = {
            dbName: "dekut_meals",
            useUnifiedTopology: true,
        }
        const connected = await mongoose.connect(uri, options);

        if (connected.connection.readyState === 1) {
            console.log("Connected to MongoDB");
            isConnected = true;
            return true;
        } else if (retries > 0) {
            console.log("Failed to connect to MongoDB");
            await new Promise(resolve => setTimeout(resolve, 3000));
            return await connectToDB(retries - 1);
        } else {
            throw new Error('Failed to connect to MongoDB');
        }

    } catch (error) {
        console.log("Failed to connect to MongoDB: ", error)
        return false;
    }
}