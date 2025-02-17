import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    photoDisplay: { type: String, required: true },
    photoDetails: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
