import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { projectsAPI, uploadAPI } from '../../services/api';

const ProjectManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: projectsData } = useQuery('projects', projectsAPI.getAll);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    technologies: '',
    featured: false,
  });

  const createMutation = useMutation(projectsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      setSuccess('Project created successfully!');
      setError('');
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create project');
      setSuccess('');
    },
  });

  const updateMutation = useMutation(
    (data: any) => projectsAPI.update(currentProject._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        setSuccess('Project updated successfully!');
        setError('');
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to update project');
        setSuccess('');
      },
    }
  );

  const deleteMutation = useMutation(projectsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.technologies) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.imageUrl) {
      setError('Please upload a project image');
      return;
    }

    const data = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(t => t),
    };

    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (project: any) => {
    setIsEditing(true);
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      technologies: project.technologies.join(', '),
      featured: project.featured,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
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
    setCurrentProject(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      demoUrl: '',
      githubUrl: '',
      technologies: '',
      featured: false,
    });
  };

  const projects = projectsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
      </div>

      {/* Form */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Project' : 'Add New Project'}
        </h3>
        
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="input"
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px]"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Image</label>
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
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured Project
            </label>
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={uploading || createMutation.isLoading || updateMutation.isLoading}
            >
              {uploading ? 'Uploading...' : (createMutation.isLoading || updateMutation.isLoading) ? 'Saving...' : (isEditing ? 'Update' : 'Create') + ' Project'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project: any) => (
          <div key={project._id} className="card">
            <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-bold mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech: string) => (
                <span key={tech} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">{project.views} views</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;
