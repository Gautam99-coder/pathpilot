  import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Cache user lookups in memory for 60 seconds to avoid DB hit on every request
const userCache = new Map();

export const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check memory cache first
      const cached = userCache.get(decoded.id);
      if (cached && Date.now() - cached.ts < 60000) {
        if (cached.user.status === 'banned') return res.status(403).json({ message: 'Account has been suspended' });
        req.user = cached.user;
        return next();
      }

      const user = await User.findById(decoded.id).select('-password').lean();
      if (!user) return res.status(401).json({ message: 'User not found' });
      
      // Ensure status is always valid
      if (!user.status || !['active', 'banned'].includes(user.status)) {
        user.status = 'active';
        // Update the database record to fix invalid status
        await User.findByIdAndUpdate(decoded.id, { status: 'active' });
      }
      
      if (user.status === 'banned') return res.status(403).json({ message: 'Account has been suspended' });

      // Store in cache
      userCache.set(decoded.id, { user, ts: Date.now() });
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Call this after profile updates so cache doesn't serve stale data
export const invalidateUserCache = (userId) => {
  userCache.delete(String(userId));
};
