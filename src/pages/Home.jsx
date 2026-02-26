import { useState, useEffect } from 'react';
import { request } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Search, Cpu, Layers, Zap } from 'lucide-react';

const CATEGORIES = ['Tech', 'AI', 'Backend', 'Frontend', 'DevOps'];

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

            {/* ── Hero Section ── */}
            <div style={{ textAlign: 'center', marginBottom: '56px', paddingTop: '32px', position: 'relative' }}>
                {/* Decorative glow orb behind title */}
                <div style={{
                    position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                    width: '400px', height: '200px',
                    background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Cpu size={16} style={{ color: '#22d3ee' }} />
                    <span style={{ fontSize: '0.78rem', color: '#22d3ee', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600' }}>
                        Knowledge Platform
                    </span>
                    <Cpu size={16} style={{ color: '#22d3ee' }} />
                </div>

                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px', lineHeight: '1.2', fontWeight: '700' }}>
                    Discover &amp;{' '}
                    <span className="gradient-text">Share Knowledge</span>
                </h1>

                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
                    Explore articles on Tech, AI, Backend, Frontend, and more.
                    Enhanced with <span style={{ color: '#a855f7', fontWeight: '600' }}>AI assistance</span> for better reading and writing.
                </p>
            </div>

            {/* ── Search & Filter Bar ── */}
            <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: '1 1 260px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Search articles, topics, or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '42px' }}
                    />
                </div>

                {/* Category pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={() => setCategory('')}
                        style={{
                            padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600',
                            cursor: 'pointer', border: 'none', transition: 'all 0.2s ease',
                            background: category === '' ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(30, 30, 60, 0.5)',
                            color: category === '' ? '#fff' : 'var(--text-muted)',
                            boxShadow: category === '' ? '0 0 12px rgba(139,92,246,0.4)' : 'none',
                        }}
                    >All</button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat === category ? '' : cat)}
                            style={{
                                padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600',
                                cursor: 'pointer', border: '1px solid rgba(99, 102, 241, 0.25)', transition: 'all 0.2s ease',
                                background: category === cat ? 'linear-gradient(135deg, #7c3aed, #0891b2)' : 'rgba(30, 30, 60, 0.5)',
                                color: category === cat ? '#fff' : 'var(--text-muted)',
                                boxShadow: category === cat ? '0 0 12px rgba(139,92,246,0.35)' : 'none',
                            }}
                        >{cat}</button>
                    ))}
                </div>
            </div>

            {/* ── Article Grid ── */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="glass-panel" style={{ height: '250px', animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px 48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Layers size={40} style={{ color: '#7c3aed', marginBottom: '16px', opacity: 0.6 }} />
                    <h2 style={{ marginBottom: '8px', color: 'var(--text)' }}>No articles found</h2>
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
