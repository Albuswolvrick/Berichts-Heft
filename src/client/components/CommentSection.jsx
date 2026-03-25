import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';

const CommentSection = ({ reportType, reportId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const isAdminOrManager = user && (user.role === 'ADMIN' || user.role === 'MANAGER');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await api.get(`/comments/${reportType}/${reportId}`);
        setComments(data);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [reportType, reportId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await api.post('/comments', {
        reportType,
        reportId,
        content: newComment,
      });
      setComments([...comments, comment]);
      setNewComment('');
      showToast(t('comment.success'), 'success');
    } catch (err) {
      showToast(t('comment.failed'), 'error');
    }
  };

  return (
    <div className="comment-section">
      <h3>{t('comment.title')}</h3>
      <div className="comment-list">
        {loading ? (
          <p>{t('comment.loading')}</p>
        ) : comments.length === 0 ? (
          <p className="no-comments">{t('comment.none')}</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <strong>{c.user.name}</strong>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="comment-content">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {isAdminOrManager && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comment.placeholder')}
            required
          />
          <button type="submit">{t('comment.submit')}</button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
