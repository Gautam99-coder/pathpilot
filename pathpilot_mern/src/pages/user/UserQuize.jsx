import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserQuiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pathId = searchParams.get("pathId");
  const phaseIndex = parseInt(searchParams.get("phaseIndex") || "0");
  const title = searchParams.get("title") || "Course";

  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!pathId) { setLoadingQ(false); return; }
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/paths/${pathId}`);
        if (res.ok) {
          const data = await res.json();
          const phase = data.phases?.[phaseIndex];
          setQuestions(phase?.quizzes || []);
        }
      } catch (err) { console.error(err); }
      setLoadingQ(false);
    };
    fetchQuiz();
  }, [pathId, phaseIndex]);

  useEffect(() => {
    if (submitted || loadingQ) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, loadingQ]);

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec < 10 ? "0" : ""}${sec}s`;
  };

  const handleSelect = (qIndex, option) => setAnswers({ ...answers, [qIndex]: option });

  const handleSubmit = async () => {
    setSubmitting(true);
    const token = localStorage.getItem('token');
    const correctAnswers = questions.reduce((acc, q, i) => answers[i] === q.correctAnswer ? acc + 1 : acc, 0);
    const percentageScore = Math.round((correctAnswers / questions.length) * 100);
    const passed = percentageScore >= 60;

    if (pathId) {
      try {
        // Submit quiz score to backend
        const res = await fetch(`/api/user/progress/${pathId}/quiz`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            phaseIndex: phaseIndex,
            score: percentageScore,
            totalQuestions: questions.length,
            correctAnswers: correctAnswers,
            courseTitle: title
          })
        });

        if (res.ok) {
          const data = await res.json();
          console.log('Quiz submitted successfully:', data);
        }
      } catch (err) { 
        console.error('Error submitting quiz:', err); 
      }
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  const score = questions.reduce((acc, q, i) => {
    return answers[i] === q.correctAnswer ? acc + 1 : acc;
  }, 0);
  const passed = questions.length > 0 && score >= Math.ceil(questions.length * 0.6);

  if (loadingQ) return <div className="flex h-screen items-center justify-center text-gray-400">Loading quiz...</div>;

  if (!questions.length) return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 text-gray-400">
      <span className="material-icons-round text-5xl">quiz</span>
      <p>No quiz available for this phase.</p>
      <button onClick={() => navigate(-1)} className="text-primary font-bold">← Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

        {!submitted && (
          <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-500 hover:text-primary flex items-center gap-1">
            ← Back
          </button>
        )}

        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-bold">{title} — Phase {phaseIndex + 1} Quiz</h1>
          {!submitted && (
            <div className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg font-bold">⏱ {formatTime()}</div>
          )}
        </div>

        {!submitted ? (
          <>
            {questions.map((q, index) => (
              <div key={index} className="mb-8">
                <h2 className="font-semibold mb-3">{index + 1}. {q.question}</h2>
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(index, opt)}
                      className={`w-full text-left p-3 border rounded-lg transition ${
                        answers[index] === opt ? "bg-indigo-100 border-indigo-500" : "hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < questions.length}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">🎯 Score: {score} / {questions.length} ({Math.round((score/questions.length)*100)}%)</h2>
            <p className="mb-4 text-gray-600">⏱ Time: {formatTime()}</p>

            {passed ? (
              <>
                <p className="text-green-600 mb-4 font-semibold">🎉 You Passed This Phase!</p>
                <p className="text-sm text-gray-600 mb-4">
                  Complete all phases with 60% average to unlock your certificate
                </p>
              </>
            ) : (
              <p className="text-red-500 mb-4">❌ You need 60% to pass this phase. Try again!</p>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/user/progress/${pathId}`)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Back to Progress
              </button>
              
              {!passed && (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
