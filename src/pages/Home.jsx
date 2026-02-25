import { useState, useEffect } from 'react';
import { request } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Search } from 'lucide-react';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const fetchArticles = async () => {
        setLoading(true);
        let url = '/articles?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}`;
        try {
            const data = await request(url);
            setArticles(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchArticles();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search, category]);

    return (
        <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '24px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Discover & Share Knowledge
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Explore articles on Tech, AI, Backend, Frontend, and more. Enhanced with AI assistance for better reading and writing.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '16px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search articles, content, or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
                <div style={{ flex: '0 0 200px' }}>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Tech">Tech</option>
                        <option value="AI">AI</option>
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="DevOps">DevOps</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="glass-panel" style={{ height: '250px', animation: 'pulse 1.5s infinite' }}></div>
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <h2>No articles found</h2>
                    <p>Try adjusting your search or category filter.</p>
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

export default Home;
