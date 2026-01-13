const { query } = require('../config/db');

/**
 * Add a course to favourites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addToFavourites = async (req, res) => {
    try {
        const { courseId } = req.params;
        const student_id = req.user.id;

        // Check if course exists
        const courseCheck = await query(
            'SELECT id FROM courses WHERE id = $1',
            [courseId]
        );

        if (courseCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if already in favourites
        const existingFavourite = await query(
            'SELECT id FROM favourites WHERE student_id = $1 AND course_id = $2',
            [student_id, courseId]
        );

        if (existingFavourite.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Course is already in your favourites'
            });
        }

        // Add to favourites
        const result = await query(
            `INSERT INTO favourites (student_id, course_id)
            VALUES ($1, $2)
            RETURNING id, student_id, course_id, created_at`,
            [student_id, courseId]
        );

        res.status(201).json({
            success: true,
            message: 'Course added to favourites',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Add favourite error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Remove a course from favourites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeFromFavourites = async (req, res) => {
    try {
        const { courseId } = req.params;
        const student_id = req.user.id;

        // Check if favourite exists
        const favouriteCheck = await query(
            'SELECT id FROM favourites WHERE student_id = $1 AND course_id = $2',
            [student_id, courseId]
        );

        if (favouriteCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course is not in your favourites'
            });
        }

        // Remove from favourites
        await query(
            'DELETE FROM favourites WHERE student_id = $1 AND course_id = $2',
            [student_id, courseId]
        );

        res.status(200).json({
            success: true,
            message: 'Course removed from favourites'
        });
    } catch (error) {
        console.error('Remove favourite error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Get all favourites for the current student with course details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyFavourites = async (req, res) => {
    try {
        const student_id = req.user.id;

        const result = await query(
            `SELECT 
                f.id as favourite_id,
                f.created_at as favourited_at,
                c.id as course_id,
                c.title,
                c.description,
                c.price,
                c.duration_hours,
                c.level,
                c.created_at as course_created_at,
                u.id as instructor_id,
                u.username as instructor_username,
                u.email as instructor_email
            FROM favourites f
            INNER JOIN courses c ON f.course_id = c.id
            INNER JOIN users u ON c.instructor_id = u.id
            WHERE f.student_id = $1
            ORDER BY f.created_at DESC`,
            [student_id]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Get favourites error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Check if a course is in favourites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkFavourite = async (req, res) => {
    try {
        const { courseId } = req.params;
        const student_id = req.user.id;

        const result = await query(
            'SELECT id FROM favourites WHERE student_id = $1 AND course_id = $2',
            [student_id, courseId]
        );

        res.status(200).json({
            success: true,
            isFavourite: result.rows.length > 0
        });
    } catch (error) {
        console.error('Check favourite error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    addToFavourites,
    removeFromFavourites,
    getMyFavourites,
    checkFavourite
};

