import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ArticleCard from '../components/ArticleCard';
import { BookOpen } from 'lucide-react';

const MyArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        // We can fetch all and filter by authorId or we could have a specific endpoint.
        // Given the endpoint logic, if we just want my articles, we can fetch all and filter client side
        // or we could add ?authorId to the backend. Since the backend /api/articles handles search/category, 
        // let's fetch all and filter by user.id for simplicity here.
        request('/articles')
            .then(data => {
                setArticles(data.filter(a => a.authorId === user?.id));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Articles</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your knowledge shares</p>
                </div>
                <Link to="/new-article" className="btn btn-primary">
                    Write New Article
                </Link>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-panel" style={{ height: '250px', animation: 'pulse 1.5s infinite opacity' }}></div>
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <div className="glass-panel" style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <BookOpen size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                    <h2>You haven't written any articles yet</h2>
                    <p style={{ marginBottom: '24px' }}>Share your knowledge with the world!</p>
                    <Link to="/new-article" className="btn btn-primary">Start Writing</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyArticles;
