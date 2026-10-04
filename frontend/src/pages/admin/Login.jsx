import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const { admin, loading, login, logout } = useAuth();

    const handleTest = async () => {
        const password = window.prompt('Password?');
        if (!password) return;
        try {
            await login('usama.husnain', password);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <p className="p-6">loading...</p>;

    return (
        <div className="space-y-3 p-6 text-brand-900">
            <p>Admin: {admin ? admin.username : 'logged out'}</p>
            <button onClick={handleTest} className="rounded bg-gold-500 px-4 py-2">
                test login
            </button>{' '}
            <button onClick={logout} className="rounded bg-brand-100 px-4 py-2">
                logout
            </button>
        </div>
    );
}