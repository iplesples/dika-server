import express from "express";
import { register, login, getUser } from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Register User
router.post("/register", register);

// 📌 Login User
router.post("/login", login);

// 📌 Ambil Data User yang sedang login (Harus pakai token)
router.get("/me", authMiddleware, getUser);

export default router;
