const express = require('express');
const {
    enrollInCourse,
    getMyEnrollments,
    updateEnrollmentProgress
} = require('../controllers/enrollmentController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkStudent } = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * @route   GET /api/enrollments/my
 * @desc    Get all enrollments for current student with course details
 * @access  Private (Student only)
 */
router.get('/my', checkAuth, checkStudent, getMyEnrollments);

/**
 * @route   POST /api/enrollments/:courseId
 * @desc    Enroll in a course
 * @access  Private (Student only)
 */
router.post('/:courseId', checkAuth, checkStudent, enrollInCourse);

/**
 * @route   PUT /api/enrollments/:enrollmentId/progress
 * @desc    Update enrollment progress
 * @access  Private (Student only)
 */
router.put('/:enrollmentId/progress', checkAuth, checkStudent, updateEnrollmentProgress);

module.exports = router;

