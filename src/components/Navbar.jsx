import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Edit3, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass-panel">
            <div className="container nav-content">
                <Link to="/" className="nav-brand">
                    <BookOpen className="brand-icon" />
                    <span>Mindbowser AI share</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {user && <Link to="/my-articles" className="nav-link">My Articles</Link>}
                    {user && (
                        <Link to="/new-article" className="nav-link btn btn-primary">
                            <Edit3 size={18} /> New Article
                        </Link>
                    )}
                    {!user ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to="/login" className="nav-link btn btn-outline">
                                <LogIn size={18} /> Login
                            </Link>
                            <Link to="/signup" className="nav-link btn btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Hello, {user.username}</span>
                            <button onClick={handleLogout} className="nav-link btn btn-outline">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
