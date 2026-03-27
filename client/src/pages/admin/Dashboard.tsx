import React, { lazy, Suspense } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { analyticsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardHome = lazy(() => import('../../components/admin/DashboardHome'));
const ProjectManager = lazy(() => import('../../components/admin/ProjectManager'));
const PostManager = lazy(() => import('../../components/admin/PostManager'));
const SkillManager = lazy(() => import('../../components/admin/SkillManager'));
const ResumeManager = lazy(() => import('../../components/admin/ResumeManager'));
const SettingsManager = lazy(() => import('../../components/admin/SettingsManager'));
const ContentManager = lazy(() => import('../admin/Content'));
const ExperienceManager = lazy(() => import('../admin/Experience'));
const EducationManager = lazy(() => import('../admin/Education'));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: stats } = useQuery('dashboardStats', analyticsAPI.getDashboard);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/content', label: 'Content', icon: '📰' },
    { path: '/admin/experience', label: 'Experience', icon: '💼' },
    { path: '/admin/education', label: 'Education', icon: '🎓' },
    { path: '/admin/projects', label: 'Projects', icon: '�' },
    { path: '/admin/posts', label: 'Posts', icon: '📝' },
    { path: '/admin/skills', label: 'Skills', icon: '🎯' },
    { path: '/admin/resume', label: 'Resume', icon: '📄' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gradient">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                View Site →
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Quick Stats */}
            {stats?.data && (
              <div className="mt-6 card">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Views</span>
                    <span className="font-semibold">{stats.data.totalViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Project Views</span>
                    <span className="font-semibold">{stats.data.projectViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Post Views</span>
                    <span className="font-semibold">{stats.data.postViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Contact Forms</span>
                    <span className="font-semibold">{stats.data.contactForms}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/dashboard" element={<DashboardHome stats={stats?.data} />} />
                <Route path="/content" element={<ContentManager />} />
                <Route path="/experience" element={<ExperienceManager />} />
                <Route path="/education" element={<EducationManager />} />
                <Route path="/projects" element={<ProjectManager />} />
                <Route path="/posts" element={<PostManager />} />
                <Route path="/skills" element={<SkillManager />} />
                <Route path="/resume" element={<ResumeManager />} />
                <Route path="/settings" element={<SettingsManager />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
