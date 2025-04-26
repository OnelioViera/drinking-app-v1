import mongoose from "mongoose";

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

if (!MONGODB_CONNECTION_STRING) {
  throw new Error(
    "Please define the MONGODB_CONNECTION_STRING environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "drinking",
    };

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_CONNECTION_STRING!, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB successfully!");
        console.log("Database name:", mongoose.connection.name);
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
