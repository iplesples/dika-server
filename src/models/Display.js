import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name: String,
  photos: [String],
});
const Brand = mongoose.model('Brand', BrandSchema);