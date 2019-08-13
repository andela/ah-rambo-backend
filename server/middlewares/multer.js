import multer from 'multer';

const storage = multer.memoryStorage();
/**
 * @name multerUploads
 * @param {object} img request string
 * @returns {json} the json response been return by the server
 */
const multerUploads = img => multer({ storage }).single(img);

export default multerUploads;
