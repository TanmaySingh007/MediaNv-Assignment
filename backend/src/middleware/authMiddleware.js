const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to verify JWT token and authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const checkAuth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization header must be in format: Bearer <token>'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user from database to ensure they still exist
        const result = await query(
            'SELECT id, username, email, role FROM users WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token is invalid.'
            });
        }

        // Attach user info to request object
        req.user = result.rows[0];
        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};

module.exports = {
    checkAuth
};

