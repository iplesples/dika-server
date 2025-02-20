// controllers/CustomerController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Endpoint: GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    // Ambil data pelanggan, hanya ambil field name, whatsapp, dan createdAt
    const customers = await User.find({}, "name whatsapp createdAt").sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint: PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { name, whatsapp, password } = req.body;
    const updateData = { name, whatsapp };

    // Jika ada password baru, hash dan masukkan ke updateData
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update data pelanggan berdasarkan ID, dan kembalikan data yang sudah diupdate (tanpa password)
    const customer = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
