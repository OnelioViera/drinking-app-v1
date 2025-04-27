import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
console.log(
  "Connection string format:",
  process.env.MONGODB_URI?.replace(
    /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
    "mongodb+srv://[USERNAME]:[PASSWORD]@"
  ) || "Not set"
);
