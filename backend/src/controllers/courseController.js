const { query } = require('../config/db');

/**
 * Get all courses with optional search and filter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllCourses = async (req, res) => {
    try {
        const { search, level } = req.query;
        
        let sqlQuery = `
            SELECT 
                c.id,
                c.title,
                c.description,
                c.price,
                c.duration_hours,
                c.level,
                c.created_at,
                c.updated_at,
                u.id as instructor_id,
                u.username as instructor_username,
                u.email as instructor_email
            FROM courses c
            INNER JOIN users u ON c.instructor_id = u.id
            WHERE 1=1
        `;
        
        const queryParams = [];
        let paramCount = 0;

        // Add search filter (matches title)
        if (search) {
            paramCount++;
            sqlQuery += ` AND c.title ILIKE $${paramCount}`;
            queryParams.push(`%${search}%`);
        }

        // Add level filter
        if (level && ['beginner', 'intermediate', 'advanced'].includes(level)) {
            paramCount++;
            sqlQuery += ` AND c.level = $${paramCount}`;
            queryParams.push(level);
        }

        sqlQuery += ` ORDER BY c.created_at DESC`;

        const result = await query(sqlQuery, queryParams);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Get a single course by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT 
                c.id,
                c.title,
                c.description,
                c.price,
                c.duration_hours,
                c.level,
                c.created_at,
                c.updated_at,
                u.id as instructor_id,
                u.username as instructor_username,
                u.email as instructor_email
            FROM courses c
            INNER JOIN users u ON c.instructor_id = u.id
            WHERE c.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Create a new course (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCourse = async (req, res) => {
    try {
        const { title, description, price, duration_hours, level } = req.body;
        const instructor_id = req.user.id; // Admin creating the course

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        // Validate level if provided
        if (level && !['beginner', 'intermediate', 'advanced'].includes(level)) {
            return res.status(400).json({
                success: false,
                message: 'Level must be beginner, intermediate, or advanced'
            });
        }

        const result = await query(
            `INSERT INTO courses (title, description, instructor_id, price, duration_hours, level)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, title, description, price, duration_hours, level, instructor_id, created_at, updated_at`,
            [title, description || null, instructor_id, price || 0.00, duration_hours || 0, level || null]
        );

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Update a course (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, duration_hours, level } = req.body;

        // Check if course exists
        const existingCourse = await query(
            'SELECT id FROM courses WHERE id = $1',
            [id]
        );

        if (existingCourse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Validate level if provided
        if (level && !['beginner', 'intermediate', 'advanced'].includes(level)) {
            return res.status(400).json({
                success: false,
                message: 'Level must be beginner, intermediate, or advanced'
            });
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        let paramCount = 0;

        if (title !== undefined) {
            paramCount++;
            updateFields.push(`title = $${paramCount}`);
            updateValues.push(title);
        }
        if (description !== undefined) {
            paramCount++;
            updateFields.push(`description = $${paramCount}`);
            updateValues.push(description);
        }
        if (price !== undefined) {
            paramCount++;
            updateFields.push(`price = $${paramCount}`);
            updateValues.push(price);
        }
        if (duration_hours !== undefined) {
            paramCount++;
            updateFields.push(`duration_hours = $${paramCount}`);
            updateValues.push(duration_hours);
        }
        if (level !== undefined) {
            paramCount++;
            updateFields.push(`level = $${paramCount}`);
            updateValues.push(level);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        paramCount++;
        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        updateValues.push(id);

        const result = await query(
            `UPDATE courses SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            updateValues
        );

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Delete a course (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if course exists
        const existingCourse = await query(
            'SELECT id FROM courses WHERE id = $1',
            [id]
        );

        if (existingCourse.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Delete course (CASCADE will handle enrollments and favourites)
        await query(
            'DELETE FROM courses WHERE id = $1',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};

