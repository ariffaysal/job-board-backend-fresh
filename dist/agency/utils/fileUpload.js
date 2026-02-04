"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadOptions = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.fileUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads/agencies',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
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
//# sourceMappingURL=fileUpload.js.map