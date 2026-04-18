  import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String },
  files: [{ title: String, url: String }],
  links: [{ title: String, url: String }],
  quizzes: [{
    question: String,
    options: [String],
    correctAnswer: String // We will store exact string answer to simplify UI logic
  }]
});

const careerPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    phases: [phaseSchema],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        review: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('CareerPath', careerPathSchema);
