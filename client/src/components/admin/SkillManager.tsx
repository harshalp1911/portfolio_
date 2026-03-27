import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { skillsAPI } from '../../services/api';

const SkillManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: skillsData } = useQuery('adminSkills', skillsAPI.getAll);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'languages',
    proficiency: 50,
    visible: true,
    order: 0,
  });

  const createMutation = useMutation(skillsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminSkills');
      resetForm();
    },
  });

  const updateMutation = useMutation(
    (data: any) => skillsAPI.update(currentSkill._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminSkills');
        resetForm();
      },
    }
  );

  const deleteMutation = useMutation(skillsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminSkills');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (skill: any) => {
    setIsEditing(true);
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      visible: skill.visible,
      order: skill.order,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentSkill(null);
    setFormData({
      name: '',
      category: 'languages',
      proficiency: 50,
      visible: true,
      order: 0,
    });
  };

  const skills = skillsData?.data || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Skills</h2>

      {/* Form */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Skill Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
                required
              >
                <option value="languages">Languages</option>
                <option value="frameworks">Frameworks</option>
                <option value="databases">Databases</option>
                <option value="tools">Tools & Tech</option>
                <option value="coursework">Coursework</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="visible" className="text-sm font-medium">
                Visible on portfolio
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update' : 'Add'} Skill
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Skills List by Category */}
      <div className="space-y-6">
        {Object.entries(skills).map(([category, categorySkills]: [string, any]) => (
          <div key={category} className="card">
            <h3 className="text-lg font-bold mb-4 capitalize">{category.replace('_', ' ')}</h3>
            <div className="space-y-3">
              {categorySkills.map((skill: any) => (
                <div key={skill._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{skill.name}</span>
                      {!skill.visible && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleEdit(skill)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(skill._id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillManager;
