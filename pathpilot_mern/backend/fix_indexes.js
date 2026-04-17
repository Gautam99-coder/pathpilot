import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fixIndexes = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('enrollments');

    console.log('Fetching current indexes...');
    const indexes = await collection.indexes();
    console.log('Existing indexes:', JSON.stringify(indexes, null, 2));

    // Drop the old index if it exists
    const oldIndexName = 'userId_1_pathId_1';
    if (indexes.find(idx => idx.name === oldIndexName)) {
      console.log(`Dropping stale index: ${oldIndexName}...`);
      await collection.dropIndex(oldIndexName);
      console.log('Successfully dropped stale index.');
    } else {
      console.log('Stale index not found. Searching for any index with "userId"...');
      const found = indexes.find(idx => JSON.stringify(idx.key).includes('userId'));
      if (found) {
        console.log(`Found suspicious index: ${found.name}. Dropping it...`);
        await collection.dropIndex(found.name);
      }
    }

    // Also drop any records with null user/path to clean up
    console.log('Cleaning up broken records (null user/path)...');
    const result = await collection.deleteMany({
      $or: [
        { user: null },
        { careerPath: null },
        { userId: { $exists: true } },
        { pathId: { $exists: true } }
      ]
    });
    console.log(`Deleted ${result.deletedCount} broken records.`);

    console.log('Creating new unique index on { user: 1, careerPath: 1 }...');
    try {
      await collection.createIndex({ user: 1, careerPath: 1 }, { unique: true });
      console.log('New unique index created successfully!');
    } catch (e) {
      console.log('Note: Index might already exist or could not be created if data is still duplicate.');
      console.error(e.message);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error fixing indexes:', err);
    process.exit(1);
  }
};

fixIndexes();
