// routes/customerRoutes.js
import express from "express";
import { getCustomers, updateCustomer } from "../controllers/CustomerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Hanya admin yang bisa mengakses daftar pelanggan dan mengupdate data pelanggan
router.get("/", authMiddleware, adminAuth, getCustomers);
router.put("/:id", authMiddleware, adminAuth, updateCustomer);

export default router;
