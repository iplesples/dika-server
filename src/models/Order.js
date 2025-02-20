import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  status: { type: String, default: "Menunggu Konfirmasi" },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;