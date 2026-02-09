import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected hogaya hai');
  } catch (error) {
    console.error('MongoDB connection failed hogaya:', error.message);
    process.exit(1);
  }
};

export default connectDB;
