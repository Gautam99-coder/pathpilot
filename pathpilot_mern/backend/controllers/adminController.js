  import CareerPath from '../models/CareerPath.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Contact from '../models/Contact.js';
import Enrollment from '../models/Enrollment.js';
import Donation from '../models/Donation.js';
import { invalidateUserCache } from '../middleware/authMiddleware.js';

// --- Dashboard Stats ---
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalPaths, totalEnrollments, recentUsers, donationTotals, recentDonations] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      CareerPath.countDocuments(),
      Enrollment.countDocuments(),
      User.find({}).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Donation.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalCount: { $sum: 1 }
          }
        }
      ]),
      Donation.find({ status: 'paid' })
        .sort({ paidAt: -1, createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .populate('careerPath', 'title')
        .lean()
    ]);

    res.json({
      totalUsers,
      totalPaths,
      totalEnrollments,
      totalDonations: donationTotals[0]?.totalCount || 0,
      totalDonationAmount: donationTotals[0]?.totalAmount || 0,
      recentActivity: recentUsers.map(u => ({
        text: `New user registered - ${u.name}`,
        time: new Date(u.createdAt).toLocaleDateString()
      })),
      recentDonations: recentDonations.map(donation => ({
        donor: donation.user?.name || 'Unknown donor',
        email: donation.user?.email || '',
        careerPath: donation.careerPath?.title || 'Career Path',
        amount: donation.amount,
        time: new Date(donation.paidAt || donation.createdAt).toLocaleDateString()
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Career Paths ---

export const createCareerPath = async (req, res) => {
  try {
    const newPath = new CareerPath(req.body);
    const createdPath = await newPath.save();
    res.status(201).json(createdPath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCareerPath = async (req, res) => {
  try {
    const updatedPath = await CareerPath.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPath) return res.status(404).json({ message: 'Path not found' });
    res.json(updatedPath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCareerPath = async (req, res) => {
  try {
    const path = await CareerPath.findByIdAndDelete(req.params.id);
    if (!path) return res.status(404).json({ message: 'Path not found' });
    res.json({ message: 'Path deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Users ---

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');

    // Ensure all users have valid status field
    const usersWithValidStatus = users.map(user => {
      const userObj = user.toObject();
      if (!userObj.status || !['active', 'banned'].includes(userObj.status)) {
        userObj.status = 'active';
      }
      return userObj;
    });

    res.json(usersWithValidStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password = 'password123', role = 'user', status = 'active', phone, location, bio, website } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.default.hash(password, 10);

    // Ensure status is always lowercase and valid
    const validStatus = status ? status.toLowerCase() : 'active';

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      status: validStatus,
      phone: phone || '',
      location: location || '',
      bio: bio || '',
      website: website || '',
      isEmailVerified: true
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      website: user.website
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      // Ensure status is always lowercase and valid
      user.status = req.body.status ? req.body.status.toLowerCase() : (user.status || 'active');

      const updatedUser = await user.save();
      invalidateUserCache(updatedUser._id);
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        isEmailVerified: updatedUser.isEmailVerified,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    invalidateUserCache(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Notifications ---

export const sendNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const notification = await Notification.create({ title, message });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user enrollments for admin view
export const getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;
    const enrollments = await Enrollment.find({ user: userId })
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
