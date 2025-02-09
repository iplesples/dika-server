import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

// Tentukan path secara eksplisit
config ({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware untuk menyajikan folder publik
app.use('/gallery', express.static(path.join(__dirname, '../public/gallery')));

app.get('/api/photos', (req, res) => {
  fs.readdir(path.join(__dirname, '../public/gallery'), (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal membaca folder gallery' });
    }
    const filePaths = files.map(file => ({
      name: file,
      url: `${process.env.BASE_URL || 'http://localhost:3000'}/gallery/${file}`
    }));
    res.json(filePaths);
  });
});



// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});