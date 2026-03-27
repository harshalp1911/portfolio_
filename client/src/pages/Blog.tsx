import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { postsAPI } from '../services/api';

const renderContent = (content: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#EF6461] hover:underline font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};

const Blog: React.FC = () => {
  const [page, setPage] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const { data, isLoading } = useQuery(['posts', page], () => postsAPI.getAll(page, 9));

  const toggleExpand = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const posts = data?.data?.posts || [];
  const totalPages = data?.data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF6461]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-slate-800/30">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-normal text-center mb-4 text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16">Thoughts, tutorials, and insights</p>

        {/* Posts Feed - LinkedIn Style */}
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post: any) => (
            <div key={post._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 hover:shadow-xl transition-shadow">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF6461] to-[#ff8a87] flex items-center justify-center text-white font-bold text-lg">
                  H
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Harshal Patil</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Post Title */}
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {post.title}
              </h2>

              {/* Post Content */}
              <div className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
                {expandedPosts.has(post._id) ? (
                  renderContent(post.content)
                ) : (
                  <>
                    {renderContent(post.content.length > 200 ? post.content.substring(0, 200) : post.content)}
                    {post.content.length > 200 && !expandedPosts.has(post._id) && '...'}
                  </>
                )}
              </div>
              
              {/* See More Button */}
              {post.content.length > 200 && (
                <button
                  onClick={() => toggleExpand(post._id)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium text-sm mb-4"
                >
                  {expandedPosts.has(post._id) ? '...see less' : '...see more'}
                </button>
              )}

              {/* Post Image */}
              {post.imageUrl && (
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full object-cover"
                  />
                  {post.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm">{post.caption}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Post Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#EF6461] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                    </svg>
                    <span className="text-sm font-medium">{post.likes || 0}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#EF6461] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments.has(post._id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment: any) => (
                        <div key={comment._id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold">
                            {comment.author.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                              <p className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author}</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#EF6461] hover:text-[#EF6461] transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === p
                    ? 'bg-[#EF6461] text-white'
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-[#EF6461] hover:text-[#EF6461]'
                }`}
              >
                {p}
              </button>
            ))}
            
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#EF6461] hover:text-[#EF6461] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
