import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { projectsAPI, analyticsAPI } from '../services/api';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const { data: projectsData, isLoading } = useQuery('projects', projectsAPI.getAll);

  const projects = projectsData?.data || [];

  const handleProjectClick = async (projectId: string) => {
    try {
      await analyticsAPI.trackEvent({
        type: 'project_view',
        itemId: projectId,
      });
    } catch (error) {
      console.error('Failed to track project view:', error);
    }
  };

  const technologies = Array.from(
    new Set(projects.flatMap((p: any) => p.technologies || []))
  ) as string[];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p: any) => p.technologies.includes(filter));

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
        <h1 className="text-4xl font-normal text-center mb-4 text-gray-900 dark:text-gray-100">Projects</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16">Explore my recent work and side projects</p>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#EF6461] text-white'
                : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-[#EF6461] hover:text-[#EF6461]'
            }`}
          >
            All
          </button>
          {technologies.slice(0, 6).map((tech: string) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tech
                  ? 'bg-[#EF6461] text-white'
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-[#EF6461] hover:text-[#EF6461]'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: any) => (
            <div
              key={project._id}
              className="card group hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleProjectClick(project._id)}
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-[#EF6461] transition-colors">
                {project.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EF6461] hover:text-[#ff8a87] font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Demo →
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EF6461] hover:text-[#ff8a87] font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub →
                    </a>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {project.views} views
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No projects found with the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
