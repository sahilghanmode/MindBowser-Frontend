import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', margin: '40px auto', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Welcome Back</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', padding: '12px', background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid var(--danger)' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }}>Login</button>
            </form>
            <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
