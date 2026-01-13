import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminCourses from './pages/Admin/AdminCourses';
import Courses from './pages/Student/Courses';
import MyEnrollments from './pages/Student/MyEnrollments';
import MyFavourites from './pages/Student/MyFavourites';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to={user?.role === 'admin' ? '/admin/courses' : '/courses'} replace />;
    }

    return children;
};

// Public Route Component (redirects if authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        if (user?.role === 'admin') {
            return <Navigate to="/admin/courses" replace />;
        } else {
            return <Navigate to="/courses" replace />;
        }
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/courses"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminCourses />
                    </ProtectedRoute>
                }
            />

            {/* Student Routes */}
            <Route
                path="/courses"
                element={
                    <ProtectedRoute requiredRole="student">
                        <Courses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-enrollments"
                element={
                    <ProtectedRoute requiredRole="student">
                        <MyEnrollments />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-favourites"
                element={
                    <ProtectedRoute requiredRole="student">
                        <MyFavourites />
                    </ProtectedRoute>
                }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
