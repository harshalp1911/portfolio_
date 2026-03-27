import React from 'react';
import { DashboardStats } from '../../types';

interface Props {
  stats?: DashboardStats;
}

const DashboardHome: React.FC<Props> = ({ stats }) => {
  if (!stats) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-sm opacity-90 mb-1">Total Views</div>
          <div className="text-3xl font-bold">{stats.totalViews}</div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-sm opacity-90 mb-1">Project Views</div>
          <div className="text-3xl font-bold">{stats.projectViews}</div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-sm opacity-90 mb-1">Post Views</div>
          <div className="text-3xl font-bold">{stats.postViews}</div>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="text-sm opacity-90 mb-1">Contact Forms</div>
          <div className="text-3xl font-bold">{stats.contactForms}</div>
        </div>
      </div>

      {/* Top Projects */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Top Projects</h3>
        <div className="space-y-3">
          {stats.topProjects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <span className="font-medium">{project.title}</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {project.views} views
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Views Chart */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Views (Last 7 Days)</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {stats.viewsByDay.map((day) => (
            <div key={day._id} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary-600 rounded-t"
                style={{
                  height: `${(day.count / Math.max(...stats.viewsByDay.map(d => d.count))) * 100}%`,
                  minHeight: '4px'
                }}
              ></div>
              <div className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                {new Date(day._id).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm font-semibold">{day.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
