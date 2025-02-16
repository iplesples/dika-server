import express from "express";
import upload from "../middlewares/Upload.js";
import Product from "../models/Product.js";

const router = express.Router();

// 📌 Create Product
router.post("/create", upload.fields([
  { name: "photoDisplay", maxCount: 1 },
  { name: "photoDetails", maxCount: 5 },
]), async (req, res) => {
  try {
    const { title, brand, description, price, color } = req.body;
    
    const photoDisplay = req.files["photoDisplay"] ? req.files["photoDisplay"][0].path : null;
    const photoDetails = req.files["photoDetails"] ? req.files["photoDetails"].map((file) => file.path) : [];
  
    if (!photoDisplay || photoDetails.length === 0) {
      return res.status(400).json({ message: "All images are required!" });
    }

    const newProduct = new Product({
      title,
      brand,
      description,
      price,
      color,
      photoDisplay,
      photoDetails,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully!", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Get Single Product
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Dapatkan Produk Berdasarkan Merek
router.get("/brand/:brandName", async (req, res) => {
  try {
    const { brandName } = req.params;
    const products = await Product.find({ brand: brandName });

    if (products.length === 0) {
      return res.status(404).json({ message: "Tidak ada produk ditemukan untuk merek ini!" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan di server" });
  }
});

// 📌 Update Product
router.put("/update/:id", upload.fields([
  { name: "photoDisplay", maxCount: 1 },
  { name: "photoDetails", maxCount: 5 },
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, brand, description, price, color } = req.body;

    const photoDisplay = req.files["photoDisplay"] ? req.files["photoDisplay"][0].path : null;
    const photoDetails = req.files["photoDetails"] ? req.files["photoDetails"].map((file) => file.path) : [];

    // Prepare the update object
    const updateData = {
      title,
      brand,
      description,
      price,
      color,
      ...(photoDisplay && { photoDisplay }),
      ...(photoDetails.length > 0 && { photoDetails }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Delete Product
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
