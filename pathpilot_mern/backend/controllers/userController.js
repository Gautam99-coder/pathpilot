  import Enrollment from '../models/Enrollment.js';
import CareerPath from '../models/CareerPath.js';
import Donation from '../models/Donation.js';
import crypto from 'crypto';

const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error('Razorpay keys are not configured on the server');
    error.status = 500;
    throw error;
  }

  return { keyId, keySecret };
};

const createRazorpayOrder = async ({ amountPaise, receipt, notes }) => {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = response.status === 401
      ? 'Razorpay authentication failed. Please check the server key ID and key secret.'
      : data?.error?.description || 'Failed to create Razorpay order';
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return data;
};

export const enrollInPath = async (req, res) => {
  try {
    const pathId = req.params.pathId || req.body.pathId;
    const path = await CareerPath.findById(pathId);
    if (!path) return res.status(404).json({ message: 'Career path not found' });

    const existingEnrollment = await Enrollment.findOne({ user: req.user._id, careerPath: pathId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      careerPath: pathId,
      progress: 0,
      streak: 0,
      learningHours: 0
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('careerPath', 'title description image category phases')
      .lean();
    
    // Add calculated fields for each enrollment
    const enrichedEnrollments = enrollments.map(enrollment => {
      const averageQuizScore = enrollment.quizScores?.length > 0 
        ? enrollment.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / enrollment.quizScores.length 
        : 0;
      
      return {
        ...enrollment,
        averageQuizScore: Math.round(averageQuizScore),
        certificateEligible: averageQuizScore >= 60
      };
    });
    
    res.json(enrichedEnrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnrollmentProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment
      .findOne({ user: req.user._id, careerPath: req.params.pathId })
      .populate('careerPath');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    
    // Enrich response with progressPercent and path data
    const totalPhases = enrollment.careerPath?.phases?.length || 1;
    const completedCount = enrollment.completedPhases?.length || 0;
    const progressPercent = Math.round((completedCount / totalPhases) * 100);
    
    // Calculate average quiz score
    const averageQuizScore = enrollment.quizScores?.length > 0 
      ? enrollment.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / enrollment.quizScores.length 
      : 0;

    const [donationSummary] = await Donation.aggregate([
      {
        $match: {
          user: enrollment.user,
          careerPath: enrollment.careerPath._id,
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      ...enrollment.toObject(),
      path: enrollment.careerPath,
      progressPercent,
      averageQuizScore: Math.round(averageQuizScore),
      certificateEligible: averageQuizScore >= 60,
      donationSummary: {
        totalAmount: donationSummary?.totalAmount || 0,
        totalCount: donationSummary?.totalCount || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markPhaseComplete = async (req, res) => {
  try {
    const { phaseId, contentHours } = req.body;
    const enrollment = await Enrollment.findOne({ user: req.user._id, careerPath: req.params.pathId }).populate('careerPath');
    
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    if (!enrollment.completedPhases.includes(phaseId)) {
      enrollment.completedPhases.push(phaseId);
      enrollment.learningHours += (contentHours || 1); // add hours
      enrollment.lastActive = Date.now();
      
      const totalPhases = enrollment.careerPath.phases.length;
      enrollment.progress = Math.round((enrollment.completedPhases.length / totalPhases) * 100);

      await enrollment.save();
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeQuizAndAwardCertificate = async (req, res) => {
  try {
    const { phaseIndex, score, totalQuestions, correctAnswers } = req.body;
    const enrollment = await Enrollment.findOne({ user: req.user._id, careerPath: req.params.pathId });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    // Calculate percentage score
    const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);

    // Update or add quiz score for this phase
    const existingScoreIndex = enrollment.quizScores.findIndex(qs => qs.phaseIndex === phaseIndex);
    
    if (existingScoreIndex >= 0) {
      // Update existing score if new score is better
      if (percentageScore > enrollment.quizScores[existingScoreIndex].score) {
        enrollment.quizScores[existingScoreIndex] = {
          phaseIndex,
          score: percentageScore,
          totalQuestions,
          correctAnswers,
          completedAt: new Date()
        };
      }
    } else {
      // Add new quiz score
      enrollment.quizScores.push({
        phaseIndex,
        score: percentageScore,
        totalQuestions,
        correctAnswers,
        completedAt: new Date()
      });
    }

    // Check if user is eligible for certificate (60% average across all phases)
    const averageScore = enrollment.getAverageQuizScore();
    const isEligible = enrollment.isCertificateEligible();

    if (isEligible && !enrollment.certificateAwarded) {
      enrollment.certificateAwarded = true;
      enrollment.certificateUrl = `/certificate?title=${encodeURIComponent(req.body.courseTitle || 'Course')}`;
    }

    await enrollment.save();
    
    res.json({
      ...enrollment.toObject(),
      averageQuizScore: averageScore,
      certificateEligible: isEligible,
      quizPassed: percentageScore >= 60
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDonationOrder = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      careerPath: req.params.pathId
    }).populate('careerPath', 'title');

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const rawAmount = Number(req.body.amount);
    const amount = Number.isFinite(rawAmount) ? Number(rawAmount.toFixed(2)) : NaN;

    if (!Number.isFinite(amount) || amount < 1) {
      return res.status(400).json({ message: 'Please enter a valid donation amount of at least 1 INR' });
    }

    const amountPaise = Math.round(amount * 100);
    const receipt = `don_${req.user._id}_${Date.now()}`;
    const order = await createRazorpayOrder({
      amountPaise,
      receipt,
      notes: {
        userId: String(req.user._id),
        pathId: String(req.params.pathId),
        careerPath: enrollment.careerPath?.title || 'Career Path'
      }
    });

    const donation = await Donation.create({
      user: req.user._id,
      careerPath: req.params.pathId,
      enrollment: enrollment._id,
      amount,
      amountPaise,
      currency: order.currency || 'INR',
      receipt,
      orderId: order.id,
      status: 'created',
      notes: req.body.notes || ''
    });

    res.status(201).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      donationId: donation._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      careerPathTitle: enrollment.careerPath?.title || 'Career Path',
      user: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || ''
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const verifyDonationPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing Razorpay payment details' });
    }

    const donation = await Donation.findOne({
      orderId: razorpayOrderId,
      user: req.user._id,
      careerPath: req.params.pathId
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation order not found' });
    }

    const { keySecret } = getRazorpayConfig();
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      donation.status = 'failed';
      donation.paymentId = razorpayPaymentId;
      donation.signature = razorpaySignature;
      await donation.save();
      return res.status(400).json({ message: 'Payment signature verification failed' });
    }

    donation.status = 'paid';
    donation.paymentId = razorpayPaymentId;
    donation.signature = razorpaySignature;
    donation.paidAt = new Date();
    await donation.save();

    res.json({
      message: 'Donation payment verified successfully',
      donation: {
        id: donation._id,
        amount: donation.amount,
        currency: donation.currency,
        paymentId: donation.paymentId,
        paidAt: donation.paidAt
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
