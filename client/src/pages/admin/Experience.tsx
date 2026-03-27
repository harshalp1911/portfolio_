import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { experienceAPI } from '../../services/api';

const Experience: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    period: '',
    description: '',
    techStack: '',
    order: 0,
  });

  const { data: experiencesData, isLoading, refetch } = useQuery('experiences', experienceAPI.getAll);
  const experiences: any[] = experiencesData?.data?.data ?? [];

  const createMutation = useMutation(
    (data: any) => experienceAPI.create(data),
    {
      onSuccess: async (response) => {
        console.log('Experience create response:', response);
        await queryClient.invalidateQueries('experiences');
        await refetch();
        setIsModalOpen(false);
        resetForm();
        alert('Experience added successfully!');
      },
      onError: (error: any) => {
        console.error('Experience create error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error adding experience: ' + errorMsg);
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => experienceAPI.update(id, data),
    {
      onSuccess: async (response) => {
        console.log('Experience update response:', response);
        await queryClient.invalidateQueries('experiences');
        await refetch();
        setIsModalOpen(false);
        resetForm();
        alert('Experience updated successfully!');
      },
      onError: (error: any) => {
        console.error('Experience update error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error updating experience: ' + errorMsg);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => experienceAPI.delete(id),
    {
      onSuccess: async (response) => {
        console.log('Experience delete response:', response);
        await queryClient.invalidateQueries('experiences');
        await refetch();
        alert('Experience deleted successfully!');
      },
      onError: (error: any) => {
        console.error('Experience delete error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error deleting experience: ' + errorMsg);
      },
    }
  );

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      period: '',
      description: '',
      techStack: '',
      order: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (exp: any) => {
    setFormData({
      position: exp.position,
      company: exp.company,
      period: exp.period,
      description: exp.description || '',
      techStack: Array.isArray(exp.techStack) ? exp.techStack.join(', ') : '',
      order: exp.order,
    });
    setEditingId(exp._id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      techStack: formData.techStack
        ? formData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [],
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Experience Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-[#EF6461] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a87] transition-colors"
        >
          Add Experience
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No experience entries found. Add your first one!
                </td>
              </tr>
            ) : (
              experiences.map((exp: any) => (
                <tr key={exp._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {exp.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{exp.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{exp.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Experience' : 'Add Experience'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Position *</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="e.g., Google Inc, Mountain View - CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Period *</label>
                <input
                  type="text"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="e.g., 2021 - Present"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="Brief description of your role and achievements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tech Stack <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="e.g., React, Node.js, MongoDB, Docker"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="bg-[#EF6461] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a87] transition-colors disabled:opacity-50"
                >
                  {createMutation.isLoading || updateMutation.isLoading
                    ? 'Saving...'
                    : editingId
                    ? 'Update'
                    : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
