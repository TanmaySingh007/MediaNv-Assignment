import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

const MyEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/enrollments/my');
            if (response.data.success) {
                setEnrollments(response.data.data);
            }
        } catch (err) {
            setError('Failed to load enrollments. Please try again.');
            console.error('Error fetching enrollments:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (enrollmentId, progress) => {
        try {
            await axiosInstance.put(`/enrollments/${enrollmentId}/progress`, {
                progress_percentage: progress,
                completed: progress === 100,
            });
            fetchEnrollments();
        } catch (err) {
            alert('Failed to update progress. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
            {/* 3D Background Effects */}
            <div className="fixed inset-0 pointer-events-none perspective-3d">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-3d-float transform-3d"></div>
                <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-3xl animate-3d-rotate transform-3d" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/5 via-purple-300/5 to-pink-300/5 rounded-full blur-3xl animate-3d-pulse transform-3d"></div>
            </div>
            
            <Navbar />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Enrollments</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-gray-600">Loading enrollments...</p>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600 text-lg mb-4">You haven't enrolled in any courses yet.</p>
                        <Link
                            to="/courses"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {enrollments.map((enrollment) => (
                            <div
                                key={enrollment.enrollment_id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {enrollment.title}
                                            </h3>
                                            {enrollment.level && (
                                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 mb-2">
                                                    {enrollment.level}
                                                </span>
                                            )}
                                            <p className="text-gray-600 text-sm mb-4">
                                                {enrollment.description || 'No description available.'}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                                <span>Instructor: <span className="font-medium">{enrollment.instructor_username}</span></span>
                                                <span>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-indigo-600">${enrollment.price}</p>
                                            {enrollment.duration_hours > 0 && (
                                                <p className="text-sm text-gray-500">{enrollment.duration_hours} hours</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Section */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Progress</span>
                                            <span className="text-sm font-semibold text-indigo-600">
                                                {enrollment.progress_percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                            <div
                                                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                                                style={{ width: `${enrollment.progress_percentage}%` }}
                                            ></div>
                                        </div>
                                        {enrollment.completed ? (
                                            <div className="flex items-center text-green-600">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">Course Completed</span>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => updateProgress(enrollment.enrollment_id, Math.min(100, enrollment.progress_percentage + 25))}
                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                                                >
                                                    Update Progress
                                                </button>
                                                {enrollment.progress_percentage >= 90 && (
                                                    <button
                                                        onClick={() => updateProgress(enrollment.enrollment_id, 100)}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEnrollments;

