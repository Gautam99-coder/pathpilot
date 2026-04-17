import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import { invalidateUserCache } from '../middleware/authMiddleware.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
  } catch (error) {
    console.error('Email error: ', error);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    await OTP.create({ email, otp });
    await sendEmail(email, 'PathPilot Verification OTP', `Your OTP is: ${otp}`);

    res.status(201).json({ message: 'User registered. Please check email for OTP.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (user) {
      user.isEmailVerified = true;
      await user.save();
      await OTP.deleteOne({ _id: otpRecord._id });
      
      const token = generateToken(user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified && user.role !== 'admin') {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    await OTP.create({ email, otp });
    await sendEmail(email, 'PathPilot Password Reset OTP', `Your OTP to reset password is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  // req.user is already loaded by authMiddleware — no extra DB query needed
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      user.website = req.body.website || user.website;
      user.phone = req.body.phone || user.phone;
      
      // Ensure status is always valid before saving
      if (!user.status || !['active', 'banned'].includes(user.status)) {
        user.status = 'active';
      }
      
      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      const updatedUser = await user.save();
      invalidateUserCache(updatedUser._id);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@pathpilot.com' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123abc', salt);

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@pathpilot.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true
    });

    res.status(201).json({ message: 'Admin seeded successfully', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
