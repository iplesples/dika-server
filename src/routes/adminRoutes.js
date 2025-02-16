// routes/adminRoutes.js
import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/AdminController.js";

const router = express.Router();

// Endpoint registrasi admin
router.post("/register", registerAdmin);

// Endpoint login admin
router.post("/login", loginAdmin);

export default router;
