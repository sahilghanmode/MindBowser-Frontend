import { Link } from 'react-router-dom';
import { Clock, User as UserIcon, Zap } from 'lucide-react';

const categoryColors = {
    Tech: { bg: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
    AI: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.35)' },
    Backend: { bg: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
    Frontend: { bg: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: 'rgba(99, 102, 241, 0.35)' },
    DevOps: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
};

const ArticleCard = ({ article }) => {
    const cat = categoryColors[article.category] || categoryColors.Tech;

    return (
        <div
            className="glass-panel animate-fade-in"
            style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                height: '100%',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    background: cat.bg,
                    color: cat.color,
                    border: `1px solid ${cat.border}`,
                    borderRadius: '100px',
                    fontWeight: '600',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                }}>
                    {article.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    {new Date(article.createdAt).toLocaleDateString()}
                </div>
            </div>

            {/* Title */}
            <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'var(--text-bright)' }}>
                <h3 style={{
                    fontSize: '1.15rem',
                    lineHeight: '1.45',
                    fontWeight: '600',
                    transition: 'color 0.2s ease',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-bright)'}
                >
                    {article.title}
                </h3>
            </Link>

            {/* Summary */}
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.6',
            }}>
                {article.summary || article.content?.replace(/<[^>]+>/g, '') || ''}
            </p>

            {/* Author */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '8px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(99, 102, 241, 0.15)',
            }}>
                <div style={{
                    width: '30px', height: '30px',
                    background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: '#fff',
                    boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)',
                    flexShrink: 0,
                }}>
                    {article.author?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{article.author?.username}</span>

                <div style={{ marginLeft: 'auto' }}>
                    <Link to={`/article/${article.id}`}
                        style={{
                            fontSize: '0.8rem',
                            color: '#a855f7',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: '600',
                            letterSpacing: '0.02em',
                        }}>
                        Read <Zap size={11} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
