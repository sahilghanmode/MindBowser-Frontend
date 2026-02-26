import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { request } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import { Clock, User as UserIcon, Tag, Edit, Trash2, Zap, ArrowLeft } from 'lucide-react';

const categoryColors = {
    Tech: { bg: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
    AI: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.35)' },
    Backend: { bg: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
    Frontend: { bg: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: 'rgba(99, 102, 241, 0.35)' },
    DevOps: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
};

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        request(`/articles/${id}`)
            .then(data => setArticle(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await request(`/articles/${id}`, { method: 'DELETE' });
                navigate('/');
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return (
        <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '80px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>Loading article...</div>
        </div>
    );
    if (!article) return (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Article not found
        </div>
    );

    const isAuthor = user && user.id === article.authorId;
    const cat = categoryColors[article.category] || categoryColors.Tech;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto' }}>

            {/* Back link */}
            <Link to="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem',
                marginBottom: '24px', transition: 'color 0.2s',
            }}
                onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
                <ArrowLeft size={14} /> Back to articles
            </Link>

            <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        {/* Category badge */}
                        <span style={{
                            display: 'inline-block', padding: '4px 14px',
                            background: cat.bg, color: cat.color,
                            border: `1px solid ${cat.border}`,
                            borderRadius: '100px', fontWeight: '600',
                            fontSize: '0.73rem', letterSpacing: '0.07em', textTransform: 'uppercase',
                            marginBottom: '16px',
                        }}>
                            {article.category}
                        </span>

                        <h1 className="break-words" style={{
                            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                            lineHeight: '1.25',
                            marginBottom: '20px',
                            color: 'var(--text-bright)',
                            fontWeight: '700',
                        }}>
                            {article.title}
                        </h1>

                        {/* Meta */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-muted)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                <div style={{
                                    width: '24px', height: '24px',
                                    background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: '#fff',
                                }}>
                                    {article.author?.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="break-words">{article.author?.username}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} />
                                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Author actions */}
                    {isAuthor && (
                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                            <Link to={`/edit-article/${article.id}`} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                <Edit size={14} /> Edit
                            </Link>
                            <button onClick={handleDelete} className="btn" style={{
                                padding: '8px 16px', fontSize: '0.85rem',
                                background: 'rgba(239, 68, 68, 0.08)',
                                color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)',
                            }}>
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* AI Summary */}
                {article.summary && (
                    <div className="break-words" style={{
                        padding: '18px 20px',
                        background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.1), rgba(6, 182, 212, 0.06))',
                        borderRadius: '10px',
                        marginBottom: '32px',
                        borderLeft: '3px solid #a855f7',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <h4 style={{ marginBottom: '8px', color: '#c084fc', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Zap size={13} /> AI Summary
                        </h4>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{article.summary}</p>
                    </div>
                )}

                {/* Article content */}
                <div
                    className="article-content"
                    style={{ lineHeight: '1.85', fontSize: '1.05rem', color: 'var(--text)' }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />

                {/* Tags */}
                {article.tags && (
                    <div style={{
                        marginTop: '48px', paddingTop: '24px',
                        borderTop: '1px solid rgba(99, 102, 241, 0.15)',
                        display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap',
                    }}>
                        <Tag size={14} color="var(--text-muted)" />
                        {article.tags.split(',').map((tag, i) => (
                            <span key={i} style={{
                                background: 'rgba(139,92,246,0.1)',
                                border: '1px solid rgba(139,92,246,0.2)',
                                color: 'var(--primary-neon)',
                                padding: '3px 12px', borderRadius: '100px',
                                fontSize: '0.8rem', fontWeight: '500',
                            }}>
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleDetail;
