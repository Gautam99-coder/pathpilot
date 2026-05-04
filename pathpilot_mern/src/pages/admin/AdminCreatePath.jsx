import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function PathBuilder() {
  const createEmptyPhase = (id) => ({
    id,
    title: "",
    content: "",
    quiz: Array.from({ length: 5 }, () => ({
      question: "",
      options: { A: "", B: "", C: "", D: "" },
      correct: "",
    })),
    link: "",
    file: null,
  });

  const [phases, setPhases] = useState([createEmptyPhase(1)]);
  const [nextId, setNextId] = useState(2);
  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardImage, setCardImage] = useState(null);
  const navigate = useNavigate();

  const handleCardImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({...prev, cardImage: "Image must be under 2MB"}));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardImage(reader.result);
        setErrors(prev => ({...prev, cardImage: ""}));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!roadmapTitle.trim()) newErrors.title = "Roadmap title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!cardImage) newErrors.cardImage = "Card image is required";

    phases.forEach((phase, pIdx) => {
      if (!phase.title.trim()) {
        newErrors[`phase_${phase.id}_title`] = "Phase title is required";
      }
      if (!phase.content.trim()) {
        newErrors[`phase_${phase.id}_content`] = "Content is required";
      }

      phase.quiz.forEach((q, qIdx) => {
        if (!q.question.trim()) {
          newErrors[`phase_${phase.id}_q_${qIdx}_question`] = "Question is required";
        }
        if (!q.correct) {
          newErrors[`phase_${phase.id}_q_${qIdx}_correct`] = "Select correct option";
        }
        ["A", "B", "C", "D"].forEach((opt) => {
          if (!q.options[opt].trim()) {
            newErrors[`phase_${phase.id}_q_${qIdx}_opt_${opt}`] = `Option ${opt} is required`;
          }
        });
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addPhase = () => {
    setPhases((prev) => [...prev, createEmptyPhase(nextId)]);
    setNextId((prev) => prev + 1);
    setIsChanged(true);
  };

  const removePhase = (id) => {
    setPhases((prev) => prev.filter((p) => p.id !== id));
    setIsChanged(true);
  };

  const updatePhase = (id, field, value) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setIsChanged(true);
  };

  const handleFileUpload = (id, file) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, file } : p))
    );
    setIsChanged(true);
  };

  const updateQuiz = (phaseId, qIndex, field, value) => {
    setPhases((prev) =>
      prev.map((p) => {
        if (p.id !== phaseId) return p;

        const updatedQuiz = [...p.quiz];

        if (field === "question") {
          updatedQuiz[qIndex].question = value;
        } else if (["A", "B", "C", "D"].includes(field)) {
          updatedQuiz[qIndex].options[field] = value;
        } else if (field === "correct") {
          updatedQuiz[qIndex].correct = value;
        }

        return { ...p, quiz: updatedQuiz };
      })
    );
    setIsChanged(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isChanged]);

  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Construct Path Object matching backend Schema
    const payload = {
      title: roadmapTitle,
      description: description,
      image: cardImage,
      category: "Course",
      phases: phases.map(p => ({
         title: p.title,
         content: p.content,
         videoUrl: p.link || "",
         quizzes: p.quiz.map(q => ({
           question: q.question,
           options: [q.options.A, q.options.B, q.options.C, q.options.D],
           correctAnswer: ["A", "B", "C", "D"].indexOf(q.correct)
         }))
      }))
    };

    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/admin/paths', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setIsChanged(false);
          navigate("/admin/career-paths");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-sans">
      {/* ✅ SIDEBAR */}
      <AdminSidebar />

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="bg-white px-10 py-5 flex justify-between items-center border-b">
          <h1 className="text-xl font-bold">Launch New Roadmap</h1>
          <button
            onClick={handlePublish}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl"
          >
            Publish Path
          </button>
        </div>

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-10">
            {/* CORE INFO */}
            <div className="bg-white p-8 rounded-3xl mb-10">
              <h3 className="font-bold mb-4 text-gray-700">Roadmap Basic Info</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">Card Image</label>
                <div className="flex items-center gap-6">
                  {cardImage ? (
                    <img src={cardImage} alt="Preview" className="w-24 h-24 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center border border-dashed border-gray-300">
                      <span className="material-icons-round text-gray-400">image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCardImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {errors.cardImage && <span className="text-red-500 text-xs ml-1 mt-1 block">{errors.cardImage}</span>}
                  </div>
                </div>
              </div>

              <input
                placeholder="Roadmap Title"
                className={`w-full mb-1 p-3 bg-gray-100 rounded-xl ${errors.title ? 'border border-red-500' : ''}`}
                value={roadmapTitle}
                onChange={(e) => {
                  setRoadmapTitle(e.target.value);
                  setIsChanged(true);
                  if (errors.title) setErrors({...errors, title: ""});
                }}
              />
              {errors.title && <span className="text-red-500 text-xs ml-2 mb-3 block">{errors.title}</span>}
              <textarea
                placeholder="Description"
                rows="3"
                className={`w-full mb-1 p-3 bg-gray-100 rounded-xl ${errors.description ? 'border border-red-500' : ''}`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsChanged(true);
                  if (errors.description) setErrors({...errors, description: ""});
                }}
              />
              {errors.description && <span className="text-red-500 text-xs ml-2 block">{errors.description}</span>}
            </div>

            {/* PHASES */}
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className="bg-white p-8 rounded-3xl mb-10"
              >
                {/* HEADER */}
                <div className="flex justify-between mb-6">
                  <h2 className="font-bold text-lg">
                    Phase {(index + 1).toString().padStart(2, "0")}
                  </h2>

                  {phases.length > 1 && (
                    <button
                      onClick={() => removePhase(phase.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* TITLE + CONTENT */}
                <input
                  placeholder="Phase Title"
                  className={`w-full mb-1 p-3 bg-gray-100 rounded-xl ${errors[`phase_${phase.id}_title`] ? 'border border-red-500' : ''}`}
                  value={phase.title}
                  onChange={(e) => {
                    updatePhase(phase.id, "title", e.target.value);
                    if (errors[`phase_${phase.id}_title`]) {
                      const newErrs = {...errors};
                      delete newErrs[`phase_${phase.id}_title`];
                      setErrors(newErrs);
                    }
                  }}
                />
                {errors[`phase_${phase.id}_title`] && <span className="text-red-500 text-xs ml-2 mb-3 block">{errors[`phase_${phase.id}_title`]}</span>}

                <textarea
                  placeholder="Learning Content"
                  className={`w-full mb-1 p-3 bg-gray-100 rounded-xl ${errors[`phase_${phase.id}_content`] ? 'border border-red-500' : ''}`}
                  value={phase.content}
                  onChange={(e) => {
                    updatePhase(phase.id, "content", e.target.value);
                    if (errors[`phase_${phase.id}_content`]) {
                      const newErrs = {...errors};
                      delete newErrs[`phase_${phase.id}_content`];
                      setErrors(newErrs);
                    }
                  }}
                />
                {errors[`phase_${phase.id}_content`] && <span className="text-red-500 text-xs ml-2 mb-6 block">{errors[`phase_${phase.id}_content`]}</span>}

                {/* ✅ MATERIAL SECTION (MOVED ABOVE QUIZ) */}
                <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                  <h3 className="font-semibold mb-4 text-gray-700">
                    Study Material
                  </h3>

                  {/* FILE */}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleFileUpload(phase.id, e.target.files[0])
                    }
                    className="w-full p-2 border rounded-xl mb-3"
                  />

                  {phase.file && (
                    <p className="text-xs text-green-600 mb-3">
                      Uploaded: {phase.file.name}
                    </p>
                  )}

                  {/* YOUTUBE */}
                  <input
                    placeholder="YouTube Link"
                    className="w-full p-3 bg-white rounded-xl border"
                    value={phase.link}
                    onChange={(e) =>
                      updatePhase(phase.id, "link", e.target.value)
                    }
                  />
                </div>

                {/* QUIZ */}
                <div className="bg-indigo-50 p-6 rounded-2xl">
                  {phase.quiz.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="bg-white p-4 mb-4 rounded-xl"
                    >
                      <input
                        placeholder={`Question ${qIndex + 1}`}
                        className={`w-full mb-1 p-2 bg-gray-100 rounded ${errors[`phase_${phase.id}_q_${qIndex}_question`] ? 'border border-red-500' : ''}`}
                        value={q.question}
                        onChange={(e) => {
                          updateQuiz(phase.id, qIndex, "question", e.target.value);
                          if (errors[`phase_${phase.id}_q_${qIndex}_question`]) {
                            const newErrs = {...errors};
                            delete newErrs[`phase_${phase.id}_q_${qIndex}_question`];
                            setErrors(newErrs);
                          }
                        }}
                      />
                      {errors[`phase_${phase.id}_q_${qIndex}_question`] && <span className="text-red-500 text-[10px] ml-1 mb-2 block">{errors[`phase_${phase.id}_q_${qIndex}_question`]}</span>}

                      {["A", "B", "C", "D"].map((opt) => (
                        <div key={opt} className="mb-2">
                          <div className="flex gap-2 items-center">
                            <input
                              type="radio"
                              name={`phase-${phase.id}-q-${qIndex}`}
                              checked={q.correct === opt}
                              onChange={() => {
                                updateQuiz(phase.id, qIndex, "correct", opt);
                                if (errors[`phase_${phase.id}_q_${qIndex}_correct`]) {
                                  const newErrs = {...errors};
                                  delete newErrs[`phase_${phase.id}_q_${qIndex}_correct`];
                                  setErrors(newErrs);
                                }
                              }}
                            />
                            <input
                              placeholder={`Option ${opt}`}
                              className={`w-full p-2 bg-gray-100 rounded ${errors[`phase_${phase.id}_q_${qIndex}_opt_${opt}`] ? 'border border-red-500' : ''}`}
                              value={q.options[opt]}
                              onChange={(e) => {
                                updateQuiz(phase.id, qIndex, opt, e.target.value);
                                if (errors[`phase_${phase.id}_q_${qIndex}_opt_${opt}`]) {
                                  const newErrs = {...errors};
                                  delete newErrs[`phase_${phase.id}_q_${qIndex}_opt_${opt}`];
                                  setErrors(newErrs);
                                }
                              }}
                            />
                          </div>
                          {errors[`phase_${phase.id}_q_${qIndex}_opt_${opt}`] && <span className="text-red-500 text-[10px] ml-6 block">{errors[`phase_${phase.id}_q_${qIndex}_opt_${opt}`]}</span>}
                        </div>
                      ))}
                      {errors[`phase_${phase.id}_q_${qIndex}_correct`] && <span className="text-red-500 text-[10px] block mt-1">{errors[`phase_${phase.id}_q_${qIndex}_correct`]}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ADD PHASE */}
            <button
              onClick={addPhase}
              className="w-full border-dashed border-2 p-10 rounded-3xl text-gray-500"
            >
              + Add Phase
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl">
          Roadmap Published Successfully
        </div>
      )}
    </div>
  );
}
