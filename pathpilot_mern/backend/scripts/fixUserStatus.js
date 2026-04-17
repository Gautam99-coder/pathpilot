import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixUserStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with invalid or missing status
    const users = await User.find({
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: '' },
        { status: 'Active' }, // Capital A
        { status: 'Banned' }  // Capital B
      ]
    });

    console.log(`Found ${users.length} users with invalid status`);

    for (const user of users) {
      const oldStatus = user.status;
      
      // Fix the status
      if (!user.status || user.status === 'Active') {
        user.status = 'active';
      } else if (user.status === 'Banned') {
        user.status = 'banned';
      }

      await user.save();
      console.log(`Fixed user ${user.email}: ${oldStatus} -> ${user.status}`);
    }

    console.log('User status fix completed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing user status:', error);
    process.exit(1);
  }
};

fixUserStatus();