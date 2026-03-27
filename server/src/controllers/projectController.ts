import { Request, Response } from 'express';
import Project from '../models/Project';
import Analytics from '../models/Analytics';

export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    project.views += 1;
    await project.save();

    await Analytics.create({
      type: 'project_view',
      itemId: project._id,
      onModel: 'Project',
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Creating project with data:', req.body);
    
    const { title, description, imageUrl, technologies } = req.body;
    
    if (!title || !description || !technologies) {
      res.status(400).json({ message: 'Missing required fields: title, description, technologies' });
      return;
    }
    
    const project = new Project(req.body);
    await project.save();
    console.log('Project created successfully:', project._id);
    res.status(201).json(project);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
