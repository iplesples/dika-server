import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Pastikan token ada dan dalam format yang benar
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan atau format salah." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Pastikan token berisi ID user yang valid
    if (!decoded.id) {
      return res.status(401).json({ message: "Token tidak valid." });
    }

    req.user = decoded; // Simpan data user di request
    next(); // Lanjut ke controller
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
};
