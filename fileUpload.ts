import { diskStorage } from 'multer';
import { extname } from 'path';

export const fileUploadOptions = {
  storage: diskStorage({
    destination: './uploads/agencies',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return callback(new Error('Only image/pdf files are allowed!'), false);
    }
    callback(null, true);
  },
};
