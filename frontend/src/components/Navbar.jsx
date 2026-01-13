import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link 
                            to={isAuthenticated ? (user?.role === 'admin' ? '/admin/courses' : '/courses') : '/'} 
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-gradient-to-br from-primary-600 to-accent-600 p-2 rounded-xl transform group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-2xl font-display font-bold gradient-text hidden sm:block">
                                EduFlow
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex md:items-center md:space-x-1">
                            {user?.role === 'admin' ? (
                                <Link
                                    to="/admin/courses"
                                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                        isActive('/admin/courses')
                                            ? 'text-primary-700 bg-primary-50 shadow-sm'
                                            : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {isActive('/admin/courses') && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></span>
                                    )}
                                    <span className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <span>Courses</span>
                                    </span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/courses"
                                        className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                            isActive('/courses')
                                                ? 'text-primary-700 bg-primary-50 shadow-sm'
                                                : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        {isActive('/courses') && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></span>
                                        )}
                                        <span className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span>Browse</span>
                                        </span>
                                    </Link>
                                    <Link
                                        to="/my-enrollments"
                                        className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                            isActive('/my-enrollments')
                                                ? 'text-primary-700 bg-primary-50 shadow-sm'
                                                : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        {isActive('/my-enrollments') && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></span>
                                        )}
                                        <span className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span>Enrollments</span>
                                        </span>
                                    </Link>
                                    <Link
                                        to="/my-favourites"
                                        className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                            isActive('/my-favourites')
                                                ? 'text-primary-700 bg-primary-50 shadow-sm'
                                                : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        {isActive('/my-favourites') && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></span>
                                        )}
                                        <span className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span>Favourites</span>
                                        </span>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-100">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-800">{user?.username}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            user?.role === 'admin' 
                                                ? 'bg-accent-100 text-accent-800' 
                                                : 'bg-primary-100 text-primary-800'
                                        }`}>
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-slate-700 hover:text-primary-700 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                        
                        {/* Mobile menu button */}
                        {isAuthenticated && (
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && isAuthenticated && (
                    <div className="md:hidden py-4 border-t border-slate-200 animate-slide-down">
                        {user?.role === 'admin' ? (
                            <Link
                                to="/admin/courses"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                            >
                                Courses
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/courses"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                                >
                                    Browse Courses
                                </Link>
                                <Link
                                    to="/my-enrollments"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                                >
                                    My Enrollments
                                </Link>
                                <Link
                                    to="/my-favourites"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                                >
                                    My Favourites
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
