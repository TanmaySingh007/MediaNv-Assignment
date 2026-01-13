const { query } = require('../config/db');

/**
 * Enroll in a course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const enrollInCourse = async (req, res) => {
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

        // Check if already enrolled
        const existingEnrollment = await query(
            'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
            [student_id, courseId]
        );

        if (existingEnrollment.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            });
        }

        // Create enrollment
        const result = await query(
            `INSERT INTO enrollments (student_id, course_id)
            VALUES ($1, $2)
            RETURNING id, student_id, course_id, enrolled_at, progress_percentage, completed`,
            [student_id, courseId]
        );

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Get all enrollments for the current student with course details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyEnrollments = async (req, res) => {
    try {
        const student_id = req.user.id;

        const result = await query(
            `SELECT 
                e.id as enrollment_id,
                e.enrolled_at,
                e.progress_percentage,
                e.completed,
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
            FROM enrollments e
            INNER JOIN courses c ON e.course_id = c.id
            INNER JOIN users u ON c.instructor_id = u.id
            WHERE e.student_id = $1
            ORDER BY e.enrolled_at DESC`,
            [student_id]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Get enrollments error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Update enrollment progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEnrollmentProgress = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { progress_percentage, completed } = req.body;
        const student_id = req.user.id;

        // Check if enrollment exists and belongs to the student
        const enrollmentCheck = await query(
            'SELECT id FROM enrollments WHERE id = $1 AND student_id = $2',
            [enrollmentId, student_id]
        );

        if (enrollmentCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        // Build update query
        const updateFields = [];
        const updateValues = [];
        let paramCount = 0;

        if (progress_percentage !== undefined) {
            if (progress_percentage < 0 || progress_percentage > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Progress percentage must be between 0 and 100'
                });
            }
            paramCount++;
            updateFields.push(`progress_percentage = $${paramCount}`);
            updateValues.push(progress_percentage);
        }

        if (completed !== undefined) {
            paramCount++;
            updateFields.push(`completed = $${paramCount}`);
            updateValues.push(completed);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        paramCount++;
        updateValues.push(enrollmentId);
        paramCount++;
        updateValues.push(student_id);

        const result = await query(
            `UPDATE enrollments 
            SET ${updateFields.join(', ')} 
            WHERE id = $${paramCount - 1} AND student_id = $${paramCount}
            RETURNING *`,
            updateValues
        );

        res.status(200).json({
            success: true,
            message: 'Enrollment updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update enrollment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    enrollInCourse,
    getMyEnrollments,
    updateEnrollmentProgress
};

