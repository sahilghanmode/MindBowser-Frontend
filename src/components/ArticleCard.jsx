import { Link } from 'react-router-dom';
import { Clock, User as UserIcon } from 'lucide-react';

const ArticleCard = ({ article }) => {
    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', borderRadius: '100px', fontWeight: '500' }}>
                    {article.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    {new Date(article.createdAt).toLocaleDateString()}
                </div>
            </div>

            <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'var(--text)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4' }}>{article.title}</h3>
            </Link>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                {article.summary || article.content.replace(/<[^>]+>/g, '') || ''}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--surface-border)' }}>
                <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {article.author?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{article.author?.username}</span>
            </div>
        </div>
    );
};

export default ArticleCard;
