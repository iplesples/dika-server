import multer from 'multer';
import path from 'path';

// Setup storage untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/gallery'); // Menyimpan file di folder public/gallery
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp ke nama file
  },
});

const upload = multer({ storage });

export default upload;