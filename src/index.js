import express from 'express';
import cors from 'cors';
import fs from 'fs';
import upload from './middleware/multer.js';
import path from 'path';
import { config } from 'dotenv';

// Tentukan path secara eksplisit
config ({ path: './.env' });

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`Server is running on port ${port}`);
});


// Middleware
app.use(cors());
app.use(express.static('public')); // Menyajikan file statis dari folder public


// Endpoint untuk upload foto
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diupload' });
  }
  res.json({ message: 'Foto berhasil diupload', filePath: `/gallery/${req.file.filename}` });
});

// Endpoint untuk mendapatkan semua foto
app.get('/api/photos', (req, res) => {
  fs.readdir('public/gallery', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal membaca folder gallery' });
    }
    const filePaths = files.map(file => ({
      name: file,
      url: `https://dika-server.vercel.app/gallery/${file}` // URL untuk mengakses gambar
    }));
    res.json(filePaths);
  });
});

// Menyajikan file statis dari folder gallery
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Mendapatkan __dirname
app.use('/gallery', express.static(path.join(__dirname, 'public/gallery')))

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});