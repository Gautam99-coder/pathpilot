import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

let razorpayCheckoutPromise;

function RazorpayLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M13.838 2 6.91 10.344h4.116L9.804 22 17.09 11.656h-4.08L13.838 2Z" />
    </svg>
  );
}

const loadRazorpayCheckout = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser window is not available'));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (razorpayCheckoutPromise) return razorpayCheckoutPromise;

  razorpayCheckoutPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.body.appendChild(script);
  });

  return razorpayCheckoutPromise;
};

const formatInr = value =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value || 0);

export default function UserProgress() {
  const { id: pathId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState({ type: '', text: '' });

  const fetchEnrollment = async () => {
    const token = localStorage.getItem('token');
    if (!token || !pathId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/progress/${pathId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setEnrollment(data);
      }
    } catch (err) {
      console.error('UserProgress fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [pathId]);

  const handleDonate = async () => {
    const token = localStorage.getItem('token');
    const enteredAmount = window.prompt('Enter donation amount in INR', '100');

    if (enteredAmount === null) {
      return;
    }

    const parsedAmount = Number(enteredAmount);

    if (!token) {
      setPaymentMessage({ type: 'error', text: 'Please log in again to continue.' });
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
      setPaymentMessage({ type: 'error', text: 'Enter a valid donation amount of at least INR 1.' });
      return;
    }

    setPaymentLoading(true);
    setPaymentMessage({ type: '', text: '' });

    try {
      const orderRes = await fetch(`/api/user/progress/${pathId}/donation/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parsedAmount })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Unable to start donation payment');
      }

      await loadRazorpayCheckout();

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PathPilot',
        description: `Donation for ${orderData.careerPathTitle}`,
        order_id: orderData.orderId,
        handler: async response => {
          try {
            setPaymentLoading(true);

            const verifyRes = await fetch(`/api/user/progress/${pathId}/donation/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            setPaymentMessage({
              type: 'success',
              text: `Donation successful. Thank you for supporting this path with ${formatInr(parsedAmount)}.`
            });
            await fetchEnrollment();
          } catch (error) {
            setPaymentMessage({ type: 'error', text: error.message });
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: orderData.user?.name || '',
          email: orderData.user?.email || '',
          contact: orderData.user?.phone || ''
        },
        notes: {
          pathId,
          careerPath: orderData.careerPathTitle
        },
        theme: {
          color: '#16a34a'
        }
      });

      razorpay.open();
      setPaymentLoading(false);
    } catch (error) {
      setPaymentMessage({ type: 'error', text: error.message });
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-400">Loading progress...</div>;

  if (!enrollment) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 flex-col gap-4">
        <span className="material-icons-round text-5xl">sentiment_dissatisfied</span>
        <p>No progress found. Please enroll first.</p>
        <Link to="/user/career-paths" className="text-primary font-bold hover:underline">
          Browse Paths
        </Link>
      </div>
    );
  }

  const { path, completedPhases = [], progressPercent = 0, donationSummary } = enrollment;
  const phases = path?.phases || [];
  const averageQuizScore = enrollment.quizScores?.length
    ? Math.round(enrollment.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / enrollment.quizScores.length)
    : 0;
  const certificateUnlocked = averageQuizScore >= 60;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Enrolled Career Path</span>
            <h1 className="text-4xl font-bold text-gray-900 mt-1">{path?.title || 'Your Path'}</h1>
            <p className="text-gray-500 mt-2">
              {progressPercent > 0 ? `${progressPercent}% complete - keep going!` : 'Enrollment successful - start your journey now.'}
            </p>
          </div>
          <Link
            to="/user/career-paths"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-indigo-700 transition"
          >
            Back to Paths
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
            <p className="text-sm text-gray-400">Overall Progress</p>
            <h2 className="text-5xl font-bold text-indigo-600 mt-3">{Math.round(progressPercent)}%</h2>
            <p className="text-gray-400 font-semibold mt-1">COMPLETED</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
            <p className="text-sm text-gray-400">Phases Done</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-3">
              {completedPhases.length} / {phases.length}
            </h2>
            <p className="text-gray-400 text-sm">Phases</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
            <p className="text-sm text-gray-400">Quiz Average</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-3">{enrollment.quizScores?.length ? `${averageQuizScore}%` : 'N/A'}</h2>
            <p className="text-gray-400 text-sm">Score</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
            <p className="text-sm text-gray-400">Certificate</p>
            <h2 className="text-2xl font-bold mt-3">
              {enrollment.certificateAwarded ? (
                <span className="text-green-600">Earned</span>
              ) : certificateUnlocked ? (
                <span className="text-green-600">Available</span>
              ) : (
                <span className="text-gray-400">Locked</span>
              )}
            </h2>
            <p className="text-gray-400 text-sm">Status</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Certificate Status</h3>
                {enrollment.quizScores?.length ? (
                  <>
                    <p className="text-sm text-gray-600 mt-1">
                      Average Quiz Score: {averageQuizScore}% {certificateUnlocked ? '- You qualify for your certificate.' : '- Reach 60% average to unlock your certificate.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {enrollment.quizScores.map((quiz, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-full ${quiz.score >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          Phase {quiz.phaseIndex + 1}: {quiz.score}%
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    Finish the phase quizzes to unlock your certificate. You can still support the platform with a donation anytime.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={handleDonate}
                disabled={paymentLoading}
                className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#072654] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0a3270] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <RazorpayLogo />
                {paymentLoading ? 'Processing...' : 'Donate with Razorpay'}
              </button>

              {certificateUnlocked && (
                <Link
                  to={`/certificate?title=${encodeURIComponent(path?.title || 'Course')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <span className="material-icons-round text-sm">workspace_premium</span>
                  Get Certificate
                </Link>
              )}

              <div className="text-sm text-gray-600 space-y-1">
                <p>Total donated: <span className="font-bold text-gray-900">{formatInr(donationSummary?.totalAmount || 0)}</span></p>
                <p>Successful payments: <span className="font-bold text-gray-900">{donationSummary?.totalCount || 0}</span></p>
              </div>

              {paymentMessage.text && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                    paymentMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {paymentMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const done = completedPhases.some(p => p.toString() === index.toString());
            const active = !done && index === completedPhases.length;
            const quizScore = enrollment.quizScores?.find(qs => qs.phaseIndex === index);

            return (
              <div key={index} className={`bg-white p-6 rounded-xl border shadow-sm ${!done && !active ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold uppercase ${done ? 'text-green-600' : active ? 'text-indigo-600' : 'text-gray-400'}`}>
                    Phase {index + 1} • {done ? 'Completed' : active ? 'In Progress' : 'Locked'}
                  </span>
                  {quizScore && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${quizScore.score >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      Quiz: {quizScore.score}%
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg mt-1">{phase.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{phase.content}</p>

                {(done || active) && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex-1 mr-6">
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className={`h-2 rounded-full ${done ? 'bg-green-500 w-full' : 'bg-indigo-600 w-[25%]'}`} />
                      </div>
                      <p className={`text-xs mt-2 font-semibold ${done ? 'text-green-600' : 'text-indigo-600'}`}>
                        {done ? '100% Complete' : 'In Progress'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/user/module?phase=Phase%20${index + 1}&title=${encodeURIComponent(path?.title || '')}&pathId=${pathId}&phaseIndex=${index}`}
                        className={`px-5 py-2 text-sm font-bold border rounded-lg hover:bg-green-50 transition ${done ? 'text-green-600 border-green-600' : 'text-indigo-600 border-indigo-600'}`}
                      >
                        {done ? 'Review' : 'Continue'}
                      </Link>

                      <Link
                        to={`/user/quiz?pathId=${pathId}&phaseIndex=${index}&title=${encodeURIComponent(path?.title || '')}`}
                        className="px-5 py-2 text-sm font-bold border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                      >
                        {quizScore ? 'Retake Quiz' : 'Take Quiz'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
