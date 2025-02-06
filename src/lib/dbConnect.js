import mongoose from "mongoose";

const dbConnect = async () => {
  const databaseURL = process.env.DATABASE_URL;

  if (!databaseURL) {
    console.log("Database URL is missing");
    return;
  }

  try {
    const conn = await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error in connecting to MongoDB");
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
