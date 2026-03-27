import { Request, Response } from 'express';
import Post from '../models/Post';
import Analytics from '../models/Analytics';

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = req.user ? {} : { published: true };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (!post.published && !req.user) {
      res.status(403).json({ message: 'Post not published' });
      return;
    }

    await Analytics.create({
      type: 'post_view',
      itemId: post._id,
      onModel: 'Post',
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    post.likes += 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    post.comments.push({ author, content, createdAt: new Date() });
    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
