import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { request } from '../services/api';
import { Sparkles, Loader2 } from 'lucide-react';
import './ArticleForm.css';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Tech');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');

    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState({ improve: false, tags: false, summary: false });

    useEffect(() => {
        if (id) {
            setLoading(true);
            request(`/articles/${id}`).then(data => {
                setTitle(data.title);
                setCategory(data.category);
                setContent(data.content);
                setTags(data.tags || '');
                setSummary(data.summary || '');
            }).catch(console.error).finally(() => setLoading(false));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await request(`/articles/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ title, category, content, tags, summary })
                });
            } else {
                await request('/articles', {
                    method: 'POST',
                    body: JSON.stringify({ title, category, content, tags, summary })
                });
            }
            navigate('/');
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAiImprove = async (type) => {
        const rawText = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/(✨ AI Suggestion:|\[AI Improved\]|\[AI Suggestion\]:?)\s*/g, '').trim();
        if (!rawText) return;

        setAiLoading(prev => ({ ...prev, improve: true }));
        try {
            const { result } = await request('/ai/improve', {
                method: 'POST',
                body: JSON.stringify({ text: rawText, type })
            });
            // Clean the existing content of previous suggestions if they exist at the top to avoid endless stacking
            const cleanContent = content.replace(/^<p><strong>✨ AI Suggestion:<\/strong>.*?<\/p>/, '');
            setContent(`<p><strong>✨ AI Suggestion:</strong> ${result}</p>` + cleanContent);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(prev => ({ ...prev, improve: false }));
        }
    };

    const handleAiTags = async () => {
        const rawText = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/(✨ AI Suggestion:|\[AI Improved\]|\[AI Suggestion\]:?)\s*/g, '').trim();
        if (!rawText) return;

        setAiLoading(prev => ({ ...prev, tags: true }));
        try {
            const { tags: suggestedTags } = await request('/ai/tags', {
                method: 'POST',
                body: JSON.stringify({ content: rawText })
            });
            setTags(suggestedTags);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(prev => ({ ...prev, tags: false }));
        }
    };

    const handleAiSummary = async () => {
        const rawText = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/(✨ AI Suggestion:|\[AI Improved\]|\[AI Suggestion\]:?)\s*/g, '').trim();
        if (!rawText) return;

        setAiLoading(prev => ({ ...prev, summary: true }));
        try {
            const { summary: generatedSummary } = await request('/ai/summarize', {
                method: 'POST',
                body: JSON.stringify({ content: rawText })
            });
            setSummary(generatedSummary);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(prev => ({ ...prev, summary: false }));
        }
    };

    if (loading && id) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '40px' }}>
                <h1 style={{ marginBottom: '32px', fontSize: '2rem' }}>{id ? 'Edit Article' : 'Create New Article'}</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ fontSize: '1.2rem', padding: '16px' }}
                            placeholder="Article title..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="Tech">Tech</option>
                                <option value="AI">AI</option>
                                <option value="Backend">Backend</option>
                                <option value="Frontend">Frontend</option>
                                <option value="DevOps">DevOps</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ color: 'var(--text-muted)' }}>Content</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="button" onClick={() => handleAiImprove('grammar')} disabled={aiLoading.improve} className="btn btn-outline ai-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                    {aiLoading.improve ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                                    Improve Writing
                                </button>
                            </div>
                        </div>

                        <div className="editor-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', overflow: 'hidden' }}>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                style={{ height: '300px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ color: 'var(--text-muted)' }}>Summary (Optional)</label>
                            <button type="button" onClick={handleAiSummary} disabled={aiLoading.summary} className="btn btn-outline ai-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                {aiLoading.summary ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                                Generate Summary
                            </button>
                        </div>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={3}
                            placeholder="A brief summary of your article..."
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ color: 'var(--text-muted)' }}>Tags</label>
                            <button type="button" onClick={handleAiTags} disabled={aiLoading.tags} className="btn btn-outline ai-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                {aiLoading.tags ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                                Suggest Tags
                            </button>
                        </div>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g. React, Node.js, AI (comma separated)"
                        />
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 32px' }}>
                            {loading ? 'Saving...' : (id ? 'Update Article' : 'Publish Article')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArticleForm;
