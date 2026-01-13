import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

const MyFavourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFavourites();
    }, []);

    const fetchFavourites = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/favourites/my');
            if (response.data.success) {
                setFavourites(response.data.data);
            }
        } catch (err) {
            setError('Failed to load favourites. Please try again.');
            console.error('Error fetching favourites:', err);
        } finally {
            setLoading(false);
        }
    };

    const removeFavourite = async (courseId) => {
        try {
            await axiosInstance.delete(`/favourites/${courseId}`);
            setFavourites(favourites.filter(fav => fav.course_id !== courseId));
        } catch (err) {
            alert('Failed to remove favourite. Please try again.');
        }
    };

    const enrollInCourse = async (courseId) => {
        try {
            await axiosInstance.post(`/enrollments/${courseId}`);
            alert('Successfully enrolled in course!');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to enroll. Please try again.';
            alert(message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
            {/* 3D Background Effects */}
            <div className="fixed inset-0 pointer-events-none perspective-3d">
                <div className="absolute top-20 right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-3d-float transform-3d"></div>
                <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-3d-rotate transform-3d" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-300/5 via-purple-300/5 to-blue-300/5 rounded-full blur-3xl animate-3d-pulse transform-3d"></div>
            </div>
            
            <Navbar />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favourites</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-gray-600">Loading favourites...</p>
                    </div>
                ) : favourites.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p className="text-gray-600 text-lg mb-4">You haven't added any courses to favourites yet.</p>
                        <Link
                            to="/courses"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favourites.map((favourite) => (
                            <div
                                key={favourite.favourite_id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">{favourite.title}</h3>
                                        <button
                                            onClick={() => removeFavourite(favourite.course_id)}
                                            className="text-red-500 hover:text-red-600 transition-colors"
                                            title="Remove from favourites"
                                        >
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {favourite.level && (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 mb-2">
                                            {favourite.level}
                                        </span>
                                    )}
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {favourite.description || 'No description available.'}
                                    </p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-2xl font-bold text-indigo-600">${favourite.price}</p>
                                            {favourite.duration_hours > 0 && (
                                                <p className="text-sm text-gray-500">{favourite.duration_hours} hours</p>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <p>Instructor:</p>
                                            <p className="font-medium">{favourite.instructor_username}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => enrollInCourse(favourite.course_id)}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Enroll Now
                                        </button>
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

export default MyFavourites;

