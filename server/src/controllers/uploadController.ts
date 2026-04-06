import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    
    if (!req.file) {
      console.log('No file in request');
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    console.log('Uploading to Cloudinary:', req.file.path);
    const isPdf = req.file.mimetype === 'application/pdf';
    const uploadOptions: any = {
      folder: 'portfolio',
    };
    if (!isPdf) {
      uploadOptions.transformation = [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ];
    } else {
      uploadOptions.resource_type = 'image';
      uploadOptions.format = 'pdf';
      uploadOptions.flags = 'attachment';
    }
    const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);

    console.log('Upload successful:', result.secure_url);
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      res.status(400).json({ message: 'Public ID is required' });
      return;
    }

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};
