const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'training-hmi-docs', // Folder khusus untuk dokumen
    resource_type: 'raw', // WAJIB untuk dokumen selain gambar
    allowed_formats: 'pdf',
  },
});

const upload = multer({ storage });

module.exports = upload;
