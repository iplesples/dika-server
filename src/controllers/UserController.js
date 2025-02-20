import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// 📌 Register User
export const register = async (req, res) => {
  try {
    const { name, whatsapp, password } = req.body;

    // Cek apakah nomor WhatsApp sudah terdaftar
    const existingUser = await User.findOne({ whatsapp });
    if (existingUser) {
      return res.status(400).json({ message: "Nomor WhatsApp sudah terdaftar" });
    }

    // Hash password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = new User({ name, whatsapp, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Pendaftaran berhasil" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Login User
export const login = async (req, res) => {
  try {
    const { whatsapp, password } = req.body;

    // Cek user di database
    const user = await User.findOne({ whatsapp });
    if (!user) {
      return res.status(400).json({ message: "User tidak ditemukan" });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, name: user.name, whatsapp: user.whatsapp } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Dapatkan Data User (Misalnya untuk profil)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Jangan kirim password
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
