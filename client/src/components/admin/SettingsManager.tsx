import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { settingsAPI } from '../../services/api';

const SettingsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: settingsData } = useQuery('settings', settingsAPI.get);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    linkedIn: '',
    github: '',
    twitter: '',
    instagram: '',
  });

  useEffect(() => {
    if (settingsData?.data) {
      setFormData({
        email: settingsData.data.email || '',
        phone: settingsData.data.phone || '',
        address: settingsData.data.address || '',
        linkedIn: settingsData.data.linkedIn || '',
        github: settingsData.data.github || '',
        twitter: settingsData.data.twitter || '',
        instagram: settingsData.data.instagram || '',
      });
    }
  }, [settingsData]);

  const updateMutation = useMutation(settingsAPI.update, {
    onSuccess: () => {
      queryClient.invalidateQueries('settings');
      setSuccess('Settings updated successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update settings');
      setSuccess('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.phone || !formData.linkedIn || !formData.github) {
      setError('Please fill in all required fields');
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Settings</h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input min-h-[80px]"
              placeholder="City, State, Country"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                LinkedIn URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className="input"
                placeholder="https://linkedin.com/in/username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                GitHub URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="input"
                placeholder="https://github.com/username"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Twitter URL (Optional)
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="input"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Instagram URL (Optional)
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="input"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsManager;
