  import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Enrollment from '../models/Enrollment.js';

dotenv.config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Drop all indexes on enrollments collection
        await Enrollment.collection.dropIndexes();
        console.log('Successfully dropped all legacy indexes for Enrollments');
        
        // Re-create the unique index
        await Enrollment.collection.createIndex({ user: 1, careerPath: 1 }, { unique: true });
        console.log('Re-created proper unique index { user: 1, careerPath: 1 }');
        
        process.exit(0);
    } catch (error) {
        console.error('Error fixing indexes:', error);
        process.exit(1);
    }
};

fixIndexes();
