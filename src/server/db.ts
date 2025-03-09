import { env } from '@/env';
import mongoose from 'mongoose';

const MONGODB_URI = env.DATABASE_URL || 'mongodb://localhost:27017/db';

// Define the cache interface
type MongooseCache = {
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
}

// Declare mongoose on global object
declare global {
    var mongoose: MongooseCache | undefined;
}

// Initialize the cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Set the cache on the global object if it doesn't exist
if (!global.mongoose) {
    global.mongoose = cached;
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        const mongooseInstance = await cached.promise;
        cached.conn = mongooseInstance.connection;

        console.log("Connected to MongoDB");
        console.log("MONGODB_URI ", MONGODB_URI);
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}

export default dbConnect;