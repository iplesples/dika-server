import Order from "../models/Order.js";
import Product from "../models/Product.js";

// 📌 Buat Pesanan Baru
export const createOrder = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const userId = req.user.id; // User diambil dari token

    // Cek apakah produk ada
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Buat pesanan baru
    const newOrder = new Order({ user: userId, product, quantity });
    await newOrder.save();

    res.status(201).json({ message: "Pesanan berhasil dibuat", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Ambil Semua Pesanan User
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Ambil Semua Pesanan (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Update Status Pesanan (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Cek apakah pesanan ada
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // Update status
    order.status = status;
    await order.save();

    res.json({ message: "Status pesanan diperbarui", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Hapus Pesanan (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Cek apakah pesanan ada
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // Hapus pesanan
    await order.deleteOne();
    res.json({ message: "Pesanan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
