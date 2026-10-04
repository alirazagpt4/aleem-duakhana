import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, meRequest } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        meRequest()
            .then((data) => setAdmin({ username: data.username }))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        const data = await loginRequest(username, password);
        localStorage.setItem('token', data.token);
        setAdmin({ username: data.username });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);