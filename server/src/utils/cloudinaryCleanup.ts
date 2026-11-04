import cloudinary from '../config/cloudinary';
import Project from '../models/Project';
import Post from '../models/Post';

// Cleanup runs after the database change and never throws, so a Cloudinary
// problem can't fail the admin action that triggered it.
const destroyFile = async (publicId: string, resourceType: 'image' | 'raw'): Promise<void> => {
  // Only ever touch files this site uploaded
  if (!publicId.startsWith('portfolio/')) return;

  try {
    const { result } = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    if (result !== 'ok') {
      console.warn(`Cloudinary cleanup: ${publicId} returned "${result}"`);
    }
  } catch (error) {
    console.error(`Cloudinary cleanup failed for ${publicId}:`, error);
  }
};

// .../<cloud>/image/upload/v123/portfolio/abc.jpg -> portfolio/abc
const getImagePublicId = (url: string): string | null => {
  const prefix = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
  if (!url.startsWith(prefix)) return null;

  const match = url.slice(prefix.length).match(/(?:^|\/)v\d+\/(.+)\.[a-z0-9]+$/i);
  return match ? decodeURIComponent(match[1]) : null;
};

export const deleteResumeFile = (publicId?: string): Promise<void> =>
  publicId ? destroyFile(publicId, 'raw') : Promise.resolve();

// Call after the record has been deleted or changed, so the check below only finds other records
export const deleteImageIfUnused = async (imageUrl?: string): Promise<void> => {
  const publicId = imageUrl && getImagePublicId(imageUrl);
  if (!publicId) return;

  try {
    const stillUsed = (await Project.exists({ imageUrl })) || (await Post.exists({ imageUrl }));
    if (stillUsed) return;
  } catch (error) {
    console.error(`Cloudinary cleanup skipped for ${publicId}:`, error);
    return;
  }

  await destroyFile(publicId, 'image');
};
