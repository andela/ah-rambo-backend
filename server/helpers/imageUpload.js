import { uploader } from 'cloudinary';
import Datauri from 'datauri';
import path from 'path';
import cloudinary from '../database/config/cloudConfig';

const dUri = new Datauri();

/**
 * @name imageUpload
 * @async
 * @param {Object} req express request object
 * @returns {string} userData  with details of new user
 */
const imageUpload = async (req) => {
  const file = dUri.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer,
    cloudinary
  ).content;
  const uploadedImage = await uploader.upload(file);
  return uploadedImage.url;
};

export default imageUpload;
