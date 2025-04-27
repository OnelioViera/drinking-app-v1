import mongoose from "mongoose";

const MONGODB_CONNECTION_STRING = process.env.MONGODB_URI;

if (!MONGODB_CONNECTION_STRING) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
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
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "drinking",
    };

    console.log("Connecting to MongoDB...");
    console.log(
      "Connection string format:",
      MONGODB_CONNECTION_STRING?.replace(
        /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
        "mongodb+srv://[USERNAME]:[PASSWORD]@"
      ) || "Not set"
    );

    cached.promise = mongoose
      .connect(MONGODB_CONNECTION_STRING!, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB successfully!");
        console.log("Database name:", mongoose.connection.name);
        console.log("Connection state:", mongoose.connection.readyState);
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

export { connectDB };
