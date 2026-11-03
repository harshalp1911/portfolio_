import { Request, Response } from 'express';
import Skill from '../models/Skill';
import { isAdmin } from '../middleware/auth';

export const getAllSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    // Hidden skills are listed only for the admin panel (?all=true with an admin token)
    const showAll = req.query.all === 'true' && isAdmin(req);
    const query = showAll ? {} : { visible: true };
    const skills = await Skill.find(query).sort({ category: 1, order: 1 });
    
    const groupedSkills = skills.reduce((acc: any, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json(groupedSkills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!skill) {
      res.status(404).json({ message: 'Skill not found' });
      return;
    }
    
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      res.status(404).json({ message: 'Skill not found' });
      return;
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
