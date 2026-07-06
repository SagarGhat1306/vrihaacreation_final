const cloudinary = require("cloudinary").v2;
const productModel = require("../models/ProductModel");
const categoryModel = require("../models/CategoryModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// shared by admin (auto-approved) and seller (pending) product creation
const buildAndSaveProduct = async (req, { sellerId, sellerName, status }) => {
  const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

  // category must exist in the category collection (dynamic categories)
  const cat = await categoryModel.findOne({ name: category, isActive: true }).lean();
  if (!cat) throw new Error("Invalid category — create it first in Categories");

  const validSub = cat.subCategories.some((s) => s.name === subCategory);
  if (!validSub) throw new Error("Invalid sub category for " + category);

  const images = [
    req.files?.image1?.[0],
    req.files?.image2?.[0],
    req.files?.image3?.[0],
    req.files?.image4?.[0],
  ].filter(Boolean);

  if (images.length === 0) {
    const err = new Error("No images uploaded");
    err.statusCode = 400;
    throw err;
  }

  const uploadedImages = await Promise.all(
    images.map(async (file) => {
      const result = await uploadToCloudinary(file.buffer);
      return { url: result.secure_url, public_id: result.public_id };
    })
  );

  // sizes now arrive as [{ size: "M", stock: 20 }, ...]
  let parsedSizes = JSON.parse(sizes);
  if (Array.isArray(parsedSizes) && typeof parsedSizes[0] === "string") {
    // backward compatibility with the old ["S","M"] format
    parsedSizes = parsedSizes.map((s) => ({ size: s, stock: 0 }));
  }
  parsedSizes = parsedSizes
    .filter((s) => s.size)
    .map((s) => ({ size: s.size, stock: Math.max(0, Number(s.stock) || 0) }));

  if (parsedSizes.length === 0) throw new Error("Add at least one size with stock");

  return productModel.create({
    name,
    description,
    price: Number(price),
    category,
    subCategory,
    bestseller: bestseller === "true",
    sizes: parsedSizes,
    image: uploadedImages,
    sellerId: sellerId || null,
    sellerName: sellerName || "Vrihaa Bazaar",
    status,
  });
};

// ADMIN add — auto approved
const addproduct = async (req, res) => {
  try {
    const product = await buildAndSaveProduct(req, { status: "approved" });
    res.status(201).json({ success: true, msg: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ success: false, msg: error.message });
  }
};

// SELLER add — goes to "pending" until admin approves
const sellerAddProduct = async (req, res) => {
  try {
    const product = await buildAndSaveProduct(req, {
      sellerId: req.seller?.id,
      sellerName: req.seller?.shopName,
      status: req.isAdmin ? "approved" : "pending",
    });
    res.status(201).json({
      success: true,
      msg: "Product submitted for approval",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ success: false, msg: error.message });
  }
};

// PUBLIC storefront list — only approved, paginated + filterable for 2000+ products
const listproduct = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 0, // 0 = no limit (keeps your existing frontend working)
      category,
      subCategory,
      search,
      sort, // low-high | high-low | newest | popular
      bestseller,
    } = req.query;

    const query = { status: "approved" };
    if (category) query.category = { $in: String(category).split(",") };
    if (subCategory) query.subCategory = { $in: String(subCategory).split(",") };
    if (bestseller === "true") query.bestseller = true;
    if (search) query.name = { $regex: search, $options: "i" };

    let sortOption = { date: -1 };
    if (sort === "low-high") sortOption = { price: 1 };
    if (sort === "high-low") sortOption = { price: -1 };
    if (sort === "popular") sortOption = { soldCount: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(0, Number(limit));

    let q = productModel.find(query).sort(sortOption).lean();
    if (limitNum > 0) q = q.skip((pageNum - 1) * limitNum).limit(limitNum);

    const [products, total] = await Promise.all([
      q,
      productModel.countDocuments(query),
    ]);

    res.json({ success: true, products, total, page: pageNum });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// ADMIN list — everything, any status, with seller info
const adminListProducts = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const products = await productModel.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// ADMIN — approve / reject seller products
const updateProductStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // approved | rejected
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }
    await productModel.findByIdAndUpdate(id, { status });
    res.json({ success: true, message: `Product ${status}` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN / SELLER — update stock for a size
const updateStock = async (req, res) => {
  try {
    const { id, size, stock } = req.body;

    const result = await productModel.updateOne(
      { _id: id, "sizes.size": size },
      { $set: { "sizes.$.stock": Math.max(0, Number(stock)) } }
    );

    if (result.matchedCount === 0) {
      return res.json({ success: false, message: "Product / size not found" });
    }
    res.json({ success: true, message: "Stock updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// PUBLIC — check live availability before checkout (frontend can call this)
const checkAvailability = async (req, res) => {
  try {
    const { items } = req.body; // [{ itemId, size, quantity }]
    const unavailable = [];

    for (const item of items) {
      const product = await productModel
        .findOne({ _id: item.itemId, status: "approved" })
        .select("name sizes")
        .lean();

      const sizeInfo = product?.sizes?.find((s) => s.size === item.size);
      if (!product || !sizeInfo || sizeInfo.stock < item.quantity) {
        unavailable.push({
          itemId: item.itemId,
          name: product?.name || "Unknown product",
          size: item.size,
          available: sizeInfo?.stock || 0,
          requested: item.quantity,
        });
      }
    }

    res.json({ success: unavailable.length === 0, unavailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const removeproduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // delete every image from Cloudinary (your existing logic, kept as-is)
    for (const img of product.image) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleproduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SELLER — list only my products
const sellerListProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ sellerId: req.seller.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addproduct,
  sellerAddProduct,
  listproduct,
  adminListProducts,
  updateProductStatus,
  updateStock,
  checkAvailability,
  removeproduct,
  singleproduct,
  sellerListProducts,
};
