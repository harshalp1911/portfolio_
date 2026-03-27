import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postsAPI, uploadAPI } from '../../services/api';

const PostManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: postsData } = useQuery('adminPosts', () => postsAPI.getAll(1, 50));
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    caption: '',
    published: false,
  });

  const createMutation = useMutation(postsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminPosts');
      setSuccess('Post created successfully!');
      setError('');
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create post');
      setSuccess('');
    },
  });

  const updateMutation = useMutation(
    (data: any) => postsAPI.update(currentPost._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminPosts');
        setSuccess('Post updated successfully!');
        setError('');
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to update post');
        setSuccess('');
      },
    }
  );

  const deleteMutation = useMutation(postsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminPosts');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.content) {
      setError('Please fill in title and content');
      return;
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (post: any) => {
    setIsEditing(true);
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || '',
      caption: post.caption || '',
      published: post.published,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      console.log('Uploading file:', file.name);
      const response = await uploadAPI.uploadImage(file);
      console.log('Upload response:', response);
      setFormData({ ...formData, imageUrl: response.data.url });
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload image';
      alert(`Failed to upload image: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      caption: '',
      published: false,
    });
  };

  const posts = postsData?.data?.posts || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Blog Posts</h2>

      {/* Form */}
      <div className="card">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm mb-4">
            {success}
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              💡 <strong>Formatting Tips:</strong><br/>
              • Add links: [Link Text](https://example.com)<br/>
              • Line breaks: Press Enter twice for new paragraph<br/>
              • Bold: **text** | Italic: *text*<br/>
              • Hashtags: #javascript #webdev
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input min-h-[200px]"
              placeholder="Write your post content here... Use markdown-style links like [GitHub](https://github.com/username)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Caption (optional)</label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="input"
              disabled={uploading}
            />
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 rounded" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={uploading}>
              {isEditing ? 'Update' : 'Create'} Post
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post._id} className="card">
            <div className="flex gap-4">
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-24 h-24 object-cover rounded" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{post.likes} likes</span>
                      <span>{post.comments.length} comments</span>
                      <span className={post.published ? 'text-green-600' : 'text-orange-600'}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostManager;
