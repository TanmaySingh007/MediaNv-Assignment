import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [favourites, setFavourites] = useState(new Set());

    useEffect(() => {
        fetchCourses();
        fetchFavourites();
    }, [searchTerm, levelFilter]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (levelFilter) params.append('level', levelFilter);

            const response = await axiosInstance.get(`/courses?${params.toString()}`);
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

    const fetchFavourites = async () => {
        try {
            const response = await axiosInstance.get('/favourites/my');
            if (response.data.success) {
                const favouriteIds = new Set(response.data.data.map(fav => fav.course_id));
                setFavourites(favouriteIds);
            }
        } catch (err) {
            // Silently fail - user might not be authenticated or no favourites
        }
    };

    const toggleFavourite = async (courseId) => {
        try {
            const isFavourite = favourites.has(courseId);
            
            if (isFavourite) {
                await axiosInstance.delete(`/favourites/${courseId}`);
                setFavourites(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(courseId);
                    return newSet;
                });
            } else {
                await axiosInstance.post(`/favourites/${courseId}`);
                setFavourites(prev => new Set([...prev, courseId]));
            }
        } catch (err) {
            console.error('Error toggling favourite:', err);
            alert('Failed to update favourite. Please try again.');
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

    const getLevelColor = (level) => {
        switch(level) {
            case 'beginner': return 'from-green-400 to-emerald-500';
            case 'intermediate': return 'from-yellow-400 to-orange-500';
            case 'advanced': return 'from-red-400 to-pink-500';
            default: return 'from-primary-400 to-accent-400';
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            
            {/* Hero Section with 3D Effects */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-purple-600 perspective-3d">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* 3D Animated Background Elements */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-3d-float transform-3d"></div>
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-400/20 rounded-full blur-3xl animate-3d-rotate transform-3d" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/15 via-pink-400/15 to-blue-400/15 rounded-full blur-3xl animate-3d-pulse transform-3d"></div>
                
                {/* 3D Geometric Shapes */}
                <div className="absolute top-40 right-1/4 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl rotate-45 animate-3d-float transform-3d border border-white/20" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full animate-3d-pulse transform-3d border border-white/20" style={{ animationDelay: '2.5s' }}></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-lg">
                            Discover Your Next
                            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                Learning Journey
                            </span>
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                            Explore our curated collection of courses designed to help you grow and excel
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                {/* Search and Filter Card */}
                <div className="card p-6 mb-8 animate-slide-up">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-12"
                            />
                        </div>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="input-field sm:w-48"
                        >
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="card p-4 mb-6 bg-red-50 border-red-200 animate-scale-in">
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block relative">
                            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-6 text-slate-600 text-lg font-medium">Loading amazing courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="card p-12 text-center animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No courses found</h3>
                        <p className="text-slate-600">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {courses.map((course, index) => (
                            <div
                                key={course.id}
                                className="card card-hover group animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Course Header with Gradient */}
                                <div className={`h-32 bg-gradient-to-br ${getLevelColor(course.level || 'beginner')} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={() => toggleFavourite(course.id)}
                                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                                favourites.has(course.id)
                                                    ? 'bg-red-500/90 text-white shadow-lg scale-110'
                                                    : 'bg-white/80 text-slate-600 hover:bg-white hover:scale-110'
                                            }`}
                                            title={favourites.has(course.id) ? 'Remove from favourites' : 'Add to favourites'}
                                        >
                                            <svg className={`w-5 h-5 transition-transform ${favourites.has(course.id) ? 'scale-110' : ''}`} fill={favourites.has(course.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    {course.level && (
                                        <div className="absolute bottom-4 left-4">
                                            <span className="badge badge-primary backdrop-blur-sm bg-white/90 text-slate-800 font-bold uppercase text-xs">
                                                {course.level}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                                        {course.description || 'No description available.'}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                                        <div>
                                            <p className="text-3xl font-bold gradient-text">${course.price}</p>
                                            {course.duration_hours > 0 && (
                                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {course.duration_hours} hours
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1">Instructor</p>
                                            <p className="text-sm font-semibold text-slate-800">{course.instructor_username}</p>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => enrollInCourse(course.id)}
                                        className="w-full btn-primary"
                                    >
                                        <span className="flex items-center justify-center space-x-2">
                                            <span>Enroll Now</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
