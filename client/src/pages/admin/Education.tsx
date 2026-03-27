import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { educationAPI } from '../../services/api';

const Education: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    period: '',
    description: '',
    order: 0,
  });

  const { data: educationData, isLoading, refetch } = useQuery('education', educationAPI.getAll);
  const education: any[] = educationData?.data?.data ?? [];

  const createMutation = useMutation(
    (data: any) => educationAPI.create(data),
    {
      onSuccess: async (response) => {
        console.log('Education create response:', response);
        await queryClient.invalidateQueries('education');
        await refetch();
        setIsModalOpen(false);
        resetForm();
        alert('Education added successfully!');
      },
      onError: (error: any) => {
        console.error('Education create error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error adding education: ' + errorMsg);
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => educationAPI.update(id, data),
    {
      onSuccess: async (response) => {
        console.log('Education update response:', response);
        await queryClient.invalidateQueries('education');
        await refetch();
        setIsModalOpen(false);
        resetForm();
        alert('Education updated successfully!');
      },
      onError: (error: any) => {
        console.error('Education update error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error updating education: ' + errorMsg);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => educationAPI.delete(id),
    {
      onSuccess: async (response) => {
        console.log('Education delete response:', response);
        await queryClient.invalidateQueries('education');
        await refetch();
        alert('Education deleted successfully!');
      },
      onError: (error: any) => {
        console.error('Education delete error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error deleting education: ' + errorMsg);
      },
    }
  );

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      period: '',
      description: '',
      order: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (edu: any) => {
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      description: edu.description || '',
      order: edu.order,
    });
    setEditingId(edu._id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Education Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-[#EF6461] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a87] transition-colors"
        >
          Add Education
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Degree
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Institution
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
            {education.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No education entries found. Add your first one!
                </td>
              </tr>
            ) : (
              education.map((edu: any) => (
                <tr key={edu._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {edu.degree}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{edu.institution}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{edu.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(edu._id)}
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
              {editingId ? 'Edit Education' : 'Add Education'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Degree *</label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="e.g., Bachelor of Technology in Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Institution *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="e.g., University Name, Location"
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
                  placeholder="e.g., 2019 - 2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-700"
                  placeholder="Brief description of your studies and achievements"
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

export default Education;
