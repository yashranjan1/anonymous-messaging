import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
}

const connection : ConnectionObject = {};

const connectDB = async () : Promise<void> => {

    if (connection.isConnected) {
        console.log('Already connected');
        return;
    }

    try {

        const db = await mongoose.connect(process.env.MONGODB_URI as string, {});

        connection.isConnected = db.connections[0].readyState;

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error("Couldn't connect to MongoDB", error);


        // process.exit(1);
    }
};

export default connectDB;