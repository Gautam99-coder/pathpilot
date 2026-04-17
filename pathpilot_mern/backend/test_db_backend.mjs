  import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function test() {
  console.log("Connecting to:", process.env.MONGODB_URI ? "URI found" : "URI MISSING");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully.");

    process.stdout.write("Querying CareerPath... ");
    const pathsCount = await mongoose.model('CareerPath').countDocuments();
    console.log("Done. Count:", pathsCount);

    process.stdout.write("Querying User... ");
    const usersCount = await mongoose.model('User').countDocuments();
    console.log("Done. Count:", usersCount);

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("Error:", err);
  }
}

// Need to define models since we are not importing them
const phaseSchema = new mongoose.Schema({ title: String });
mongoose.model('CareerPath', new mongoose.Schema({ title: String, phases: [phaseSchema] }));
mongoose.model('User', new mongoose.Schema({ name: String, email: String, role: String }));

test();
