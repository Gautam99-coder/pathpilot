import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserSidebar from "../../components/user/UserSidebar";

export default function UserEditPath() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("LIVE");
  const [showToast, setShowToast] = useState(false);

  const [roadmapImage, setRoadmapImage] = useState(null);

  const [phases, setPhases] = useState([
    {
      title: "HTML & CSS Foundations",
      weeks: "2 Weeks",
      summary: "Basic structure and styling of web pages.",
      image: null,
      quiz: [
        {
          question: "",
          options: ["", "", "", ""],
          answer: ""
        }
      ]
    }
  ]);

  // ---------------- PHASE ----------------
  const addPhase = () => {
    setPhases([
      ...phases,
      {
        title: "",
        weeks: "",
        summary: "",
        image: null,
        quiz: [
          {
            question: "",
            options: ["", "", "", ""],
            answer: ""
          }
        ]
      }
    ]);
  };

  const removePhase = (index) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...phases];
    updated[index][field] = value;
    setPhases(updated);
  };

  // ---------------- IMAGE ----------------
  const handlePhaseImage = (index, file) => {
    const updated = [...phases];
    updated[index].image = file;
    setPhases(updated);
  };

  // ---------------- QUIZ ----------------
  const addQuiz = (pIndex) => {
    const updated = [...phases];
    updated[pIndex].quiz.push({
      question: "",
      options: ["", "", "", ""],
      answer: ""
    });
    setPhases(updated);
  };

  const handleQuizChange = (pIndex, qIndex, field, value) => {
    const updated = [...phases];
    updated[pIndex].quiz[qIndex][field] = value;
    setPhases(updated);
  };

  const handleOptionChange = (pIndex, qIndex, oIndex, value) => {
    const updated = [...phases];
    updated[pIndex].quiz[qIndex].options[oIndex] = value;
    setPhases(updated);
  };

  const removeQuiz = (pIndex, qIndex) => {
    const updated = [...phases];
    updated[pIndex].quiz.splice(qIndex, 1);
    setPhases(updated);
  };

  const handleUpdate = () => {
    console.log({ roadmapImage, phases, status });
    setShowToast(true);
    setTimeout(() => navigate("/user/career-mgmt"), 1800);
  };

  const badgeColor =
    status === "LIVE"
      ? "bg-green-100 text-green-600"
      : status === "DRAFT"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-gray-200 text-gray-500";

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/70 border-b px-10 py-4 flex justify-between items-center">

          <div>
            <p className="text-xs text-gray-400 font-semibold tracking-wider">
              USER / EDIT ROADMAP
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              Frontend Developer Masterclass
            </h1>
          </div>

          <div className="flex gap-3 items-center">

            <span className={`px-4 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
              {status}
            </span>

            <Link
              to="/user/career-mgmt"
              className="px-5 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm font-medium"
            >
              Cancel
            </Link>

            <button
              onClick={handleUpdate}
              className="bg-primary hover:scale-105 transition px-6 py-2 text-white rounded-xl shadow-md flex gap-2 items-center"
            >
              <span className="material-icons-round text-sm">save</span>
              Update
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto px-10 py-10">

          <div className="max-w-5xl mx-auto space-y-10">

            {/* GENERAL SECTION */}
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border">

              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                ⚙️ General Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <input defaultValue="Frontend Developer Masterclass" className="input-modern" />
                <input defaultValue="4 Months" className="input-modern" />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-modern font-semibold"
                >
                  <option value="LIVE">LIVE</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>

                <input defaultValue="Web Development" className="input-modern" />

                <textarea defaultValue="Master frontend..." className="input-modern md:col-span-2" />

                {/* ROADMAP IMAGE */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRoadmapImage(e.target.files[0])}
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* PHASES */}
            <div>
              <h2 className="text-lg font-semibold mb-6">📚 Learning Phases</h2>

              {phases.map((phase, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-6 shadow-md border hover:shadow-xl transition mb-6"
                >
                  <div className="flex justify-between items-center mb-4">

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        Phase {index + 1}
                      </h3>
                    </div>

                    <button
                      onClick={() => removePhase(index)}
                      className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                    >
                      <span className="material-icons-round">delete</span>
                    </button>
                  </div>

                  <div className="space-y-3">

                    <input
                      value={phase.title}
                      onChange={(e) => handleChange(index, "title", e.target.value)}
                      placeholder="Phase Title"
                      className="input-modern"
                    />

                    <input
                      value={phase.weeks}
                      onChange={(e) => handleChange(index, "weeks", e.target.value)}
                      placeholder="Duration"
                      className="input-modern"
                    />

                    <textarea
                      value={phase.summary}
                      onChange={(e) => handleChange(index, "summary", e.target.value)}
                      placeholder="Description..."
                      className="input-modern"
                    />

                    {/* PHASE IMAGE */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhaseImage(index, e.target.files[0])}
                    />

                    {/* QUIZ */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold mb-2">🧠 Quiz</h3>

                      {phase.quiz.map((q, qIndex) => (
                        <div key={qIndex} className="mb-2">

                          <input
                            placeholder="Question"
                            className="input-modern mb-1"
                            value={q.question}
                            onChange={(e) =>
                              handleQuizChange(index, qIndex, "question", e.target.value)
                            }
                          />

                          {q.options.map((opt, oIndex) => (
                            <input
                              key={oIndex}
                              placeholder={`Option ${oIndex + 1}`}
                              className="input-modern mb-1"
                              value={opt}
                              onChange={(e) =>
                                handleOptionChange(index, qIndex, oIndex, e.target.value)
                              }
                            />
                          ))}

                          <input
                            placeholder="Correct Answer"
                            className="input-modern"
                            value={q.answer}
                            onChange={(e) =>
                              handleQuizChange(index, qIndex, "answer", e.target.value)
                            }
                          />

                          <button
                            onClick={() => removeQuiz(index, qIndex)}
                            className="text-red-500 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addQuiz(index)}
                        className="text-blue-500 text-sm mt-1"
                      >
                        + Add Question
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              {/* ADD BUTTON */}
              <button
                onClick={addPhase}
                className="w-full py-6 border-2 border-dashed rounded-2xl text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <span className="material-icons-round">add</span>
                Add New Phase
              </button>
            </div>

          </div>
        </main>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg flex gap-2 items-center animate-bounce">
          <span className="material-icons-round text-green-400">check_circle</span>
          Saved successfully
        </div>
      )}
    </div>
  );
}
