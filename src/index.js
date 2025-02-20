// index.js
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import "./config/cloudinary.js"; // Inisialisasi Cloudinary jika diperlukan

dotenv.config();

const app = express();

// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Koneksi ke MongoDB Atlas
connectDB();

// Tes respone
app.get('/', (req, res) => {
  res.send('hallo gaes')
})

// Gunakan product
app.use("/api/products", productRoutes);

// Daftarkan route admin dengan prefix /api/admin
app.use("/api/admin", adminRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
