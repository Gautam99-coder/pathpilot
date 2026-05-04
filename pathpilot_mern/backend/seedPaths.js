import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CareerPath from './models/CareerPath.js';

dotenv.config({ path: '.env' });

const genericPhases = (pathName, phase1QuizStr) => [
  {
    title: `Phase 1: ${pathName} Basics`,
    description: `Understand the fundamental concepts of ${pathName}.`,
    content: `Start your journey in ${pathName} with robust foundational knowledge.`,
    links: [{ title: "Crash Course", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
    files: [{ title: "Official Handbook", url: "https://example.com/handbook.pdf" }],
    quizzes: [
      { question: `What is a core concept in ${pathName}?`, options: [phase1QuizStr, "Cooking", "Driving", "None"], correctAnswer: phase1QuizStr },
      { question: "Is this technology scalable?", options: ["Yes", "No", "Maybe", "Never"], correctAnswer: "Yes" },
      { question: "Best way to learn?", options: ["Practice", "Sleep", "Ignore", "Delete"], correctAnswer: "Practice" },
      { question: "Is it in demand?", options: ["Highly", "Low", "No", "Negative"], correctAnswer: "Highly" },
      { question: "Can it be done remote?", options: ["Yes", "Never", "Rarely", "Impossible"], correctAnswer: "Yes" }
    ]
  },
  {
    title: `Phase 2: Intermediate Tools`,
    description: `Learn the industry-standard tooling.`,
    content: `Deep dive into advanced topics related to ${pathName}.`,
    links: [{ title: "Advanced Course", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
    files: [{ title: "Advanced Handbook", url: "https://example.com/adv-handbook.pdf" }],
    quizzes: [
      { question: "What should you use for version control?", options: ["Git", "Nothing", "Email", "Slack"], correctAnswer: "Git" },
      { question: "What is CI/CD?", options: ["Continuous Integration", "Cooking Inside", "Cat/Cow", "None"], correctAnswer: "Continuous Integration" },
      { question: "Why test code?", options: ["Reduce bugs", "Waste time", "No reason", "Looks cool"], correctAnswer: "Reduce bugs" },
      { question: "Best debugging tool?", options: ["Debugger", "Print", "Guessing", "Praying"], correctAnswer: "Debugger" },
      { question: "Is documentation important?", options: ["Crucial", "Optional", "Useless", "Negative"], correctAnswer: "Crucial" }
    ]
  },
  {
    title: `Phase 3: Portfolio & Real-World Projects`,
    description: `Build end-to-end projects.`,
    content: `Solidify your ${pathName} skills by building realistic technical projects.`,
    links: [{ title: "Project Walkthrough", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
    files: [{ title: "Project Template", url: "https://example.com/template.pdf" }],
    quizzes: [
      { question: "Where to host your code?", options: ["GitHub", "MySpace", "Facebook", "Twitter"], correctAnswer: "GitHub" },
      { question: "Should you share your portfolio?", options: ["Always", "Never", "Only to mom", "Why?"], correctAnswer: "Always" },
      { question: "What matters in a project?", options: ["Impact", "Length", "Color", "Nothing"], correctAnswer: "Impact" },
      { question: "How to handle failure?", options: ["Learn from it", "Quit", "Cry", "Blame others"], correctAnswer: "Learn from it" },
      { question: "Final exam ready?", options: ["Absolutely", "No", "Maybe", "Help"], correctAnswer: "Absolutely" }
    ]
  }
];

const paths = [
  {
    title: "Data Scientist",
    description: "Analyze data and build ML models to solve complex problems.",
    image: "/assets/datascience.png",
    category: "Data",
    phases: genericPhases("Data Science", "Machine Learning")
  },
  {
    title: "AI & ML Engineer",
    description: "Design and implement cutting-edge artificial intelligence systems.",
    image: "/assets/ai-ml.png",
    category: "AI",
    phases: genericPhases("Artificial Intelligence", "Neural Networks")
  },
  {
    title: "Android Developer",
    description: "Build robust mobile experiences for Android devices using Kotlin.",
    image: "/assets/androidDev.png",
    category: "Mobile",
    phases: genericPhases("Android Development", "Kotlin")
  },
  {
    title: "Backend Developer",
    description: "Create scalable server-side systems and APIs using Node.js.",
    image: "/assets/backendDev.png",
    category: "Web",
    phases: genericPhases("Backend Setup", "Node.js & Databases")
  },
  {
    title: "Cloud Engineer",
    description: "Manage and deploy highly available infrastructure on AWS.",
    image: "/assets/cloudEngineer.png",
    category: "Cloud",
    phases: genericPhases("Cloud Hosting", "AWS EC2/S3")
  },
  {
    title: "Cyber Security Analyst",
    description: "Protect systems, networks, and data from cyber attacks.",
    image: "/assets/cybersecurity.png",
    category: "Security",
    phases: genericPhases("InfoSec", "Ethical Hacking")
  },
  {
    title: "DevOps Engineer",
    description: "Bridge the gap between development and operations with automated pipelines.",
    image: "/assets/devopsEngineer.png",
    category: "Cloud",
    phases: genericPhases("DevOps Tooling", "Docker & CI/CD")
  },
  {
    title: "Full Stack Developer",
    description: "Master both frontend and backend to build complete web applications.",
    image: "/assets/fullstackdev.png",
    category: "Web",
    phases: genericPhases("Full Stack Web", "React & Express")
  },
  {
    title: "Game Developer",
    description: "Design and program immersive 2D and 3D video games.",
    image: "/assets/gameDev.png",
    category: "Gaming",
    phases: genericPhases("Game Programming", "Unity / C#")
  },
  {
    title: "UI/UX Designer",
    description: "Create beautiful, accessible, and user-centric interfaces.",
    image: "/assets/uiuxdesigner.png",
    category: "Design",
    phases: genericPhases("UX Research", "Figma Prototyping")
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Wiping old paths...');
    await CareerPath.deleteMany({});
    
    console.log(`Inserting ${paths.length} career paths...`);
    await CareerPath.insertMany(paths);
    
    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
