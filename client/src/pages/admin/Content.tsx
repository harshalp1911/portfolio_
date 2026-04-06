import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { contentAPI } from '../../services/api';

const Content: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'hero' | 'about'>('hero');
  
  const { data: heroData, refetch: refetchHero } = useQuery('heroContent', () => contentAPI.get('hero'));
  const { data: aboutData, refetch: refetchAbout } = useQuery('aboutContent', () => contentAPI.get('about'));

  const [heroForm, setHeroForm] = useState({
    tagline: '',
    title: '',
    description: '',
    primaryButtonText: '',
    primaryButtonLink: '',
  });

  const [aboutForm, setAboutForm] = useState({
    title: '',
    description1: '',
    description2: '',
    contactTitle: '',
    contactSubtitle: '',
    email: '',
  });

  React.useEffect(() => {
    if (heroData?.data?.data?.hero) {
      setHeroForm(heroData.data.data.hero);
    }
  }, [heroData]);

  React.useEffect(() => {
    if (aboutData?.data?.data?.about) {
      setAboutForm(aboutData.data.data.about);
    }
  }, [aboutData]);

  const updateHeroMutation = useMutation(
    (data: any) => contentAPI.update('hero', data),
    {
      onSuccess: async (response) => {
        console.log('Hero update response:', response);
        await queryClient.invalidateQueries('heroContent');
        await refetchHero();
        alert('Hero section updated successfully!');
      },
      onError: (error: any) => {
        console.error('Hero update error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error updating hero section: ' + errorMsg);
      },
    }
  );

  const updateAboutMutation = useMutation(
    (data: any) => contentAPI.update('about', data),
    {
      onSuccess: async (response) => {
        console.log('About update response:', response);
        await queryClient.invalidateQueries('aboutContent');
        await refetchAbout();
        alert('About section updated successfully!');
      },
      onError: (error: any) => {
        console.error('About update error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        alert('Error updating about section: ' + errorMsg);
      },
    }
  );

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroMutation.mutate(heroForm);
  };

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutMutation.mutate(aboutForm);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hero'
                ? 'border-[#EF6461] text-[#EF6461]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-[#EF6461] text-[#EF6461]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            About Section
          </button>
        </nav>
      </div>

      {activeTab === 'hero' && (
        <form onSubmit={handleHeroSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input
              type="text"
              value={heroForm.tagline}
              onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
              placeholder="GET EVERY SINGLE SOLUTIONS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title (use \n for line breaks)</label>
            <textarea
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
              placeholder="I'm Full Stack Developer\nHarshal Patil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Button Text</label>
              <input
                type="text"
                value={heroForm.primaryButtonText}
                onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Button Link</label>
              <input
                type="text"
                value={heroForm.primaryButtonLink}
                onChange={(e) => setHeroForm({ ...heroForm, primaryButtonLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> The Resume button is automatically linked to the resume uploaded in the Resume section of the admin panel.
            </p>
          </div>

          <button
            type="submit"
            disabled={updateHeroMutation.isLoading}
            className="bg-[#EF6461] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a87] transition-colors disabled:opacity-50"
          >
            {updateHeroMutation.isLoading ? 'Saving...' : 'Save Hero Section'}
          </button>
        </form>
      )}

      {activeTab === 'about' && (
        <form onSubmit={handleAboutSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium mb-2">Title (use \n for line breaks)</label>
            <textarea
              value={aboutForm.title}
              onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
              placeholder="Designing With Passion While\nExploring The World."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description 1</label>
            <textarea
              value={aboutForm.description1}
              onChange={(e) => setAboutForm({ ...aboutForm, description1: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description 2</label>
            <textarea
              value={aboutForm.description2}
              onChange={(e) => setAboutForm({ ...aboutForm, description2: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Title (use \n for line breaks)</label>
            <textarea
              value={aboutForm.contactTitle}
              onChange={(e) => setAboutForm({ ...aboutForm, contactTitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
              placeholder="Any Type Of Query\n& Discussion."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Subtitle</label>
            <input
              type="text"
              value={aboutForm.contactSubtitle}
              onChange={(e) => setAboutForm({ ...aboutForm, contactSubtitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={aboutForm.email}
              onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#EF6461] focus:border-transparent dark:bg-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={updateAboutMutation.isLoading}
            className="bg-[#EF6461] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a87] transition-colors disabled:opacity-50"
          >
            {updateAboutMutation.isLoading ? 'Saving...' : 'Save About Section'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Content;
