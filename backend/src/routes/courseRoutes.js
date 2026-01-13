const express = require('express');
const { body, validationResult } = require('express-validator');
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * @route   GET /api/courses
 * @desc    Get all courses (public, with optional search and level filter)
 * @access  Public
 */
router.get('/', getAllCourses);

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course by ID
 * @access  Public
 */
router.get('/:id', getCourseById);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Admin only)
 */
router.post(
    '/',
    checkAuth,
    checkAdmin,
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 200 })
            .withMessage('Title must be less than 200 characters'),
        body('description')
            .optional()
            .trim(),
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('duration_hours')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Duration must be a non-negative integer'),
        body('level')
            .optional()
            .isIn(['beginner', 'intermediate', 'advanced'])
            .withMessage('Level must be beginner, intermediate, or advanced')
    ],
    validate,
    createCourse
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update a course
 * @access  Private (Admin only)
 */
router.put(
    '/:id',
    checkAuth,
    checkAdmin,
    [
        body('title')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Title cannot be empty')
            .isLength({ max: 200 })
            .withMessage('Title must be less than 200 characters'),
        body('description')
            .optional()
            .trim(),
        body('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('duration_hours')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Duration must be a non-negative integer'),
        body('level')
            .optional()
            .isIn(['beginner', 'intermediate', 'advanced'])
            .withMessage('Level must be beginner, intermediate, or advanced')
    ],
    validate,
    updateCourse
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course
 * @access  Private (Admin only)
 */
router.delete('/:id', checkAuth, checkAdmin, deleteCourse);

module.exports = router;

