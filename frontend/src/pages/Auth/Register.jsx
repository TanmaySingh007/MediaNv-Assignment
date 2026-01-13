import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/admin/courses');
            } else {
                navigate('/courses');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const result = await register(
                formData.username,
                formData.email,
                formData.password,
                formData.role
            );

            if (result.success) {
                // Redirect based on role
                if (result.user.role === 'admin') {
                    navigate('/admin/courses');
                } else {
                    navigate('/courses');
                }
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-600 via-purple-600 to-primary-600">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* 3D Floating Shapes */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-accent-400/30 to-purple-400/30 rounded-full blur-3xl animate-3d-float perspective-3d transform-3d"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-blue-400/30 rounded-full blur-3xl animate-3d-float perspective-3d transform-3d" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-accent-400/20 rounded-full blur-3xl animate-3d-rotate perspective-3d transform-3d"></div>
            
            {/* 3D Geometric Shapes */}
            <div className="absolute top-40 left-20 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl -rotate-45 animate-3d-pulse perspective-3d transform-3d border border-white/20"></div>
            <div className="absolute bottom-40 right-20 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full animate-3d-float perspective-3d transform-3d border border-white/20" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-60 left-1/3 w-16 h-16 bg-primary-400/20 backdrop-blur-sm rounded-lg -rotate-12 animate-3d-pulse perspective-3d transform-3d" style={{ animationDelay: '1.5s' }}></div>

            <div className="relative z-10 w-full max-w-md animate-scale-in">
                <div className="glass-effect rounded-3xl shadow-2xl p-8 md:p-10">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-display font-bold text-white mb-2">Join EduFlow</h2>
                        <p className="text-white/80">Start your learning adventure today</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-400/50 rounded-xl backdrop-blur-sm animate-scale-in">
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-red-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-100 text-sm font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-white/90 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                minLength={3}
                                maxLength={50}
                                placeholder="Choose a username"
                                className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-slate-900 placeholder-slate-500 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-300 transition-all duration-300 shadow-lg"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-slate-900 placeholder-slate-500 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-300 transition-all duration-300 shadow-lg"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-semibold text-white/90 mb-2">
                                I want to
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-slate-900 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-300 transition-all duration-300 shadow-lg"
                            >
                                <option value="student" className="text-slate-900">Learn as a Student</option>
                                <option value="admin" className="text-slate-900">Teach as an Admin</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Create a strong password"
                                className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-slate-900 placeholder-slate-500 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-300 transition-all duration-300 shadow-lg"
                            />
                            <small className="text-white/60 text-xs mt-1 block">
                                Must be at least 6 characters with uppercase, lowercase, and number
                            </small>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/90 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-slate-900 placeholder-slate-500 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-300 transition-all duration-300 shadow-lg"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-white to-white/90 text-accent-700 font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-accent-700 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-white/70 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white font-bold hover:text-yellow-300 transition-colors underline decoration-2 underline-offset-4">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
