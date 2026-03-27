import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postsAPI } from '../services/api';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const { data, isLoading } = useQuery(['post', id], () => postsAPI.getById(id!), {
    enabled: !!id,
  });

  const likeMutation = useMutation(() => postsAPI.like(id!), {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
    },
  });

  const commentMutation = useMutation(
    (data: { author: string; content: string }) => postsAPI.addComment(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', id]);
        setCommentAuthor('');
        setCommentContent('');
      },
    }
  );

  const handleLike = () => {
    likeMutation.mutate();
  };

  const renderContent = (content: string) => {
    const paragraphs = content.split(/\n\n+/);
    return paragraphs.map((paragraph, pIdx) => {
      const lines = paragraph.split('\n');
      const renderLine = (line: string, lIdx: number): React.ReactNode[] => {
        const parts: React.ReactNode[] = [];
        const regex = /(\*\*(.+?)\*\*)|(\*([^*]+?)\*)|(\[(.+?)\]\((.+?)\))|(#\w+)/g;
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
          }
          const key = `${pIdx}-${lIdx}-${match.index}`;
          if (match[1]) {
            parts.push(<strong key={key}>{match[2]}</strong>);
          } else if (match[3]) {
            parts.push(<em key={key}>{match[4]}</em>);
          } else if (match[5]) {
            parts.push(
              <a key={key} href={match[7]} target="_blank" rel="noopener noreferrer"
                className="text-[#EF6461] hover:underline font-medium">
                {match[6]}
              </a>
            );
          } else if (match[8]) {
            parts.push(
              <span key={key} className="text-[#EF6461] font-medium">{match[8]}</span>
            );
          }
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < line.length) {
          parts.push(line.slice(lastIndex));
        }
        return parts.length > 0 ? parts : [line];
      };
      return (
        <p key={pIdx} className="mb-5 leading-relaxed">
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {renderLine(line, lIdx)}
              {lIdx < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentAuthor.trim() && commentContent.trim()) {
      commentMutation.mutate({ author: commentAuthor, content: commentContent });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const post = data?.data;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/blog" className="text-primary-600 hover:text-primary-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link
          to="/blog"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

          {post.caption && (
            <p className="text-xl italic text-gray-600 dark:text-gray-400 mb-6">
              {post.caption}
            </p>
          )}

          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>

            <button
              onClick={handleLike}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {post.likes} Likes
            </button>

            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              </svg>
              {post.comments.length} Comments
            </span>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div>{renderContent(post.content)}</div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">
              Comments ({post.comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-8 card">
              <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="input"
                  required
                />
                <textarea
                  placeholder="Your Comment"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="input min-h-[100px]"
                  required
                />
                <button
                  type="submit"
                  disabled={commentMutation.isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {commentMutation.isLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.map((comment: any, index: number) => (
                <div key={index} className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {post.comments.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
