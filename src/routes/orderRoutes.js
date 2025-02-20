import express from "express";
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder 
} from "../controllers/OrderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// 📌 User membuat pesanan
router.post("/", authMiddleware, createOrder);

// 📌 User melihat daftar pesanannya sendiri
router.get("/my-orders", authMiddleware, getUserOrders);

// 📌 Admin melihat semua pesanan
router.get("/", authMiddleware, adminAuth, getAllOrders);

// 📌 Admin memperbarui status pesanan
router.put("/:id", authMiddleware, adminAuth, updateOrderStatus);

// 📌 Admin menghapus pesanan
router.delete("/:id", authMiddleware, adminAuth, deleteOrder);

export default router;
