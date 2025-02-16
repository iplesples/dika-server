// controllers/adminController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 10; // Tentukan salt rounds untuk bcrypt

// Endpoint untuk registrasi admin
export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cek apakah admin dengan username yang sama sudah ada
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username sudah digunakan." });
    }

    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan data admin baru
    const newAdmin = await Admin.create({ username, password: hashedPassword });
    res.status(201).json({ message: "Admin berhasil didaftarkan.", admin: newAdmin });
  } catch (error) {
    console.error("Error registrasi admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
};

// Endpoint untuk login admin
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari admin berdasarkan username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Kredensial tidak valid." });
    }

    // Bandingkan password yang diinput dengan hash yang tersimpan
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

    res.json({ token });
  } catch (error) {
    console.error("Error saat login admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
};
