import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/admin/orders', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-brand-900">Aleem Dua Khana - Portal</h1>
                    <p className="mt-1 text-sm text-muted">Sign in to manage orders and products</p>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-ink">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-ink">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" loading={loading} className="w-full justify-center py-2.5">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}