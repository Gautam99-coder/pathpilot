import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected.");

    const user = await mongoose.model('User', new mongoose.Schema({ email: String })).findOne({});
    if (!user) {
      console.log("No users found in DB. Please register one.");
      return;
    }
    console.log("Found user:", user.email, "ID:", user._id);

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    console.log("Generated token.");

    console.log("Fetching /api/auth/profile with valid token...");
    const res = await fetch("http://127.0.0.1:5005/api/auth/profile", {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Result status:", res.status);
    const data = await res.json();
    console.log("Data received:", !!data);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
