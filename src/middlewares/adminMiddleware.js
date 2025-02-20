// middlewares/adminMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const adminAuth = (req, res, next) => {
  const token = req.header("Authorization");

  // Cek apakah token tersedia
  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak tersedia." });
  }

  try {
    // Ambil token setelah "Bearer "
    const splitToken = token.split(" ");
    if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
      return res.status(401).json({ message: "Format token salah." });
    }

    const decoded = jwt.verify(splitToken[1], process.env.JWT_SECRET);

    // Pastikan token berasal dari admin
    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: "Token tidak valid." });
    }

    req.admin = decoded; // Simpan informasi admin ke req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau kadaluarsa." });
  }
};
