// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    userType: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Start loading as true
    const [error, setError] = useState<string | null>(null);

    // Check for token and set user on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode the token (if it's a JWT) to get user details
            const decodedUser = decodeToken(token); // Implement this function
            setUser(decodedUser);
        }
        setLoading(false); // Set loading to false after checking
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
            const { token, user: userData } = response.data;

            // Save the token to localStorage
            localStorage.setItem('token', token);

            // Set user state
            setUser(userData);
        } catch (err: any) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Utility function to decode JWT (you can use a library like jwt-decode)
const decodeToken = (token: string): User => {
    // This is a simple example; implement decoding logic based on your token structure
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        userType: payload.userType
    };
};
