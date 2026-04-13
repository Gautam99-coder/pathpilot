import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GuestNavbar from "../../components/guest/GuestNavbar";
import UserNavbar from "../../components/user/UserNavbar";
import GuestFooter from "../../components/guest/GuestFooter";

const questions = [
  {
    id: 1,
    question: "What is your primary interest in IT?",
    options: [
      { text: "Building visual interfaces and user experiences", tag: "web", category: "web" },
      { text: "Scalable server logic, APIs, and databases", tag: "backend", category: "web" },
      { text: "Data analysis, predictions, and machine learning", tag: "data", category: "data" },
      { text: "Protecting systems and securing networks", tag: "security", category: "security" }
    ]
  },
  {
    id: 2,
    question: "Which environment sounds most exciting?",
    options: [
      { text: "Web Browsers & Modern Frameworks", tag: "web" },
      { text: "Cloud Infrastructures & Linux Servers", tag: "cloud" },
      { text: "Mobile Devices (Android/iOS)", tag: "mobile" },
      { text: "Neural Networks & Big Data", tag: "ai" }
    ]
  },
  {
    id: 3,
    question: "How do you feel about mathematics and statistics?",
    options: [
      { text: "I love it, the more data the better!", tag: "data" },
      { text: "I prefer logic over complex math formulas", tag: "backend" },
      { text: "I like visuals more than calculation", tag: "design" },
      { text: "I enjoy algebraic puzzles and cryptography", tag: "security" }
    ]
  },
  {
    id: 4,
    question: "What is your goal for your first project?",
    options: [
      { text: "A beautiful portofolio website", tag: "design" },
      { text: "A secure banking system API", tag: "security" },
      { text: "A smart recommendation engine", tag: "ai" },
      { text: "A real-time chat application", tag: "web" }
    ]
  }
];

export default function PathFinder() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (tag) => {
    const newAnswers = [...answers, tag];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateRecommendations(newAnswers);
    }
  };

  const generateRecommendations = async (finalAnswers) => {
    setLoading(true);
    setStep(questions.length); // Results step

    try {
      const res = await fetch("/api/paths");
      const allPaths = await res.json();

      // Simple scoring: Count occurrences of tags in answers
      // and match against path titles/categories/descriptions
      const scores = allPaths.map(path => {
        let score = 0;
        finalAnswers.forEach(tag => {
          if (path.category?.toLowerCase().includes(tag.toLowerCase())) score += 3;
          if (path.title?.toLowerCase().includes(tag.toLowerCase())) score += 2;
          if (path.description?.toLowerCase().includes(tag.toLowerCase())) score += 1;
        });
        return { ...path, score };
      });

      const topPaths = scores
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setRecommendations(topPaths);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {isLoggedIn ? <UserNavbar /> : <GuestNavbar />}

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          
          {/* PROGRESS BAR */}
          <div className="h-2 bg-gray-100">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${((step) / questions.length) * 100}%` }}
            />
          </div>

          <div className="p-10 md:p-16">
            {step < questions.length ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">
                  Question {step + 1} of {questions.length}
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
                  {questions[step].question}
                </h2>
                <div className="space-y-4">
                  {questions[step].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.tag)}
                      className="w-full text-left p-6 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-indigo-50 transition-all group relative overflow-hidden"
                    >
                      <div className="relative z-10 font-bold text-gray-700 group-hover:text-primary">
                        {opt.text}
                      </div>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <span className="material-icons-round text-primary">arrow_forward</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                <p className="text-gray-500 font-bold">Analyzing your preferences...</p>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                <span className="material-icons-round text-6xl text-green-500 mb-6">verified</span>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">We found your path!</h2>
                <p className="text-gray-500 mb-10">Based on your interests, we recommend these career roadmaps:</p>

                <div className="grid gap-6 text-left mb-10">
                  {recommendations.length > 0 ? recommendations.map((p, i) => (
                    <div key={i} className="bg-indigo-50 p-6 rounded-2xl flex justify-between items-center group hover:bg-indigo-600 transition-all cursor-pointer shadow-sm border border-indigo-100" onClick={() => navigate(isLoggedIn ? `/user/course/${p._id}` : '/login')}>
                      <div>
                        <h3 className="font-black text-indigo-900 group-hover:text-white transition-colors">{p.title}</h3>
                        <p className="text-xs text-indigo-500 group-hover:text-indigo-100 transition-colors">{p.category} • {p.phases?.length} Phases</p>
                      </div>
                      <span className="material-icons-round text-indigo-400 group-hover:text-white transition-all transform group-hover:translate-x-1">chevron_right</span>
                    </div>
                  )) : (
                    <p className="text-gray-400 italic">No exact matches found, try browsing our full catalog!</p>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <Link to={isLoggedIn ? "/user/career-paths" : "/login"} className="bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition active:scale-95">
                    {isLoggedIn ? "Browse More Paths" : "Login to Start Learning"}
                  </Link>
                  <button onClick={() => { setStep(0); setAnswers([]); }} className="text-gray-400 font-bold hover:text-gray-600 transition">
                    Take Quiz Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <GuestFooter />
    </div>
  );
}
