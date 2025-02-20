// controllers/adminController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10; // Ambil dari .env atau gunakan default 10

// Registrasi Admin
export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cek apakah username sudah digunakan
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username sudah digunakan." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan admin baru
    const newAdmin = await Admin.create({ username, password: hashedPassword });

    // Jangan kirim password dalam respons
    res.status(201).json({
      message: "Admin berhasil didaftarkan.",
      admin: { id: newAdmin._id, username: newAdmin.username },
    });
  } catch (error) {
    console.error("Error registrasi admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cek apakah admin ada
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Kredensial tidak valid." });
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Kredensial tidak valid." });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    console.error("Error saat login admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
};
