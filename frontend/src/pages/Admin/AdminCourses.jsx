import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration_hours: '',
        level: '',
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/courses');
            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (err) {
            setError('Failed to load courses. Please try again.');
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreate = () => {
        setEditingCourse(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            duration_hours: '',
            level: '',
        });
        setShowModal(true);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description || '',
            price: course.price,
            duration_hours: course.duration_hours,
            level: course.level || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                duration_hours: parseInt(formData.duration_hours) || 0,
            };

            if (editingCourse) {
                await axiosInstance.put(`/courses/${editingCourse.id}`, payload);
            } else {
                await axiosInstance.post('/courses', payload);
            }

            setShowModal(false);
            fetchCourses();
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save course. Please try again.');
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/courses/${courseId}`);
            fetchCourses();
        } catch (err) {
            setError('Failed to delete course. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
            {/* 3D Background Effects */}
            <div className="fixed inset-0 pointer-events-none perspective-3d">
                <div className="absolute top-20 right-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-3d-float transform-3d"></div>
                <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-accent-400/10 rounded-full blur-3xl animate-3d-rotate transform-3d" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/5 via-blue-300/5 to-pink-300/5 rounded-full blur-3xl animate-3d-pulse transform-3d"></div>
            </div>
            
            <Navbar />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                    <button
                        onClick={handleCreate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        + Create New Course
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-gray-600">Loading courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No courses found. Create your first course!</p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {courses.map((course) => (
                                <li key={course.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                                                {course.level && (
                                                    <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                        {course.level}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                {course.description || 'No description'}
                                            </p>
                                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Price: <span className="font-semibold text-indigo-600">${course.price}</span></span>
                                                {course.duration_hours > 0 && (
                                                    <span>Duration: {course.duration_hours} hours</span>
                                                )}
                                                <span>Instructor: {course.instructor_username}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingCourse ? 'Edit Course' : 'Create New Course'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                                    <input
                                        type="number"
                                        name="duration_hours"
                                        value={formData.duration_hours}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white"
                                >
                                    <option value="">Select Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    {editingCourse ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;

