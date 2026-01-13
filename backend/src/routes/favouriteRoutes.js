const express = require('express');
const {
    addToFavourites,
    removeFromFavourites,
    getMyFavourites,
    checkFavourite
} = require('../controllers/favouriteController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkStudent } = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * @route   POST /api/favourites/:courseId
 * @desc    Add a course to favourites
 * @access  Private (Student only)
 */
router.post('/:courseId', checkAuth, checkStudent, addToFavourites);

/**
 * @route   DELETE /api/favourites/:courseId
 * @desc    Remove a course from favourites
 * @access  Private (Student only)
 */
router.delete('/:courseId', checkAuth, checkStudent, removeFromFavourites);

/**
 * @route   GET /api/favourites/my
 * @desc    Get all favourites for current student with course details
 * @access  Private (Student only)
 */
router.get('/my', checkAuth, checkStudent, getMyFavourites);

/**
 * @route   GET /api/favourites/:courseId/check
 * @desc    Check if a course is in favourites
 * @access  Private (Student only)
 */
router.get('/:courseId/check', checkAuth, checkStudent, checkFavourite);

module.exports = router;

