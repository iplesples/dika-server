import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Konfigurasi dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk CORS
app.use(cors());

// Middleware untuk parsing JSON
app.use(express.json());

// Contoh route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mulai server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});