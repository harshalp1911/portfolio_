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

      {/* Recent Projects */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Recent Projects</h3>
        <div className="space-y-3">
          {stats.recentProjects.map((project) => (
            <div
              key={project._id}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <span className="font-medium">{project.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
