import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');

                if (storedUser && storedToken) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password,
            });

            if (response.data.success) {
                const { user: userData, token } = response.data.data;
                
                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Update state
                setUser(userData);
                setIsAuthenticated(true);

                return {
                    success: true,
                    user: userData,
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed',
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.',
            };
        }
    };

    // Register function
    const register = async (username, email, password, role) => {
        try {
            const response = await axiosInstance.post('/auth/register', {
                username,
                email,
                password,
                role,
            });

            if (response.data.success) {
                const { user: userData, token } = response.data.data;
                
                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Update state
                setUser(userData);
                setIsAuthenticated(true);

                return {
                    success: true,
                    user: userData,
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Registration failed',
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Please try again.',
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

