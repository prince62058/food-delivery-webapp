import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    // Simple auth check - in a real app, you'd verify a token
    // For now, just pass through
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
