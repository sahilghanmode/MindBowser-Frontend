import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { request } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import { Clock, User as UserIcon, Tag, Edit, Trash2 } from 'lucide-react';

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

    if (loading) return <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '40px' }}>Loading article...</div>;
    if (!article) return <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>Article not found</div>;

    const isAuthor = user && user.id === article.authorId;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <span style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', borderRadius: '100px', fontWeight: '600', marginBottom: '16px' }}>
                            {article.category}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '24px' }}>{article.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UserIcon size={16} />
                                <span>{article.author?.username}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={16} />
                                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {isAuthor && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to={`/edit-article/${article.id}`} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                                <Edit size={16} /> Edit
                            </Link>
                            <button onClick={handleDelete} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    )}
                </div>

                {article.summary && (
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '32px', borderLeft: '4px solid var(--accent)' }}>
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>AI Summary</h4>
                        <p>{article.summary}</p>
                    </div>
                )}

                <div
                    className="article-content"
                    style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />

                {article.tags && (
                    <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Tag size={16} color="var(--text-muted)" />
                        {article.tags.split(',').map((tag, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem' }}>
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
