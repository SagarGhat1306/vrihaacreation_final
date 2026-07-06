const categoryModel = require("../models/CategoryModel");
const productModel = require("../models/ProductModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("cloudinary").v2;

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// PUBLIC — used by storefront navbar + admin Add page
const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    res.json({ success: true, categories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN — all categories including inactive
const listAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({}).sort({ sortOrder: 1 }).lean();
    res.json({ success: true, categories });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN — create a category (optionally with image + comma separated subcategories)
const addCategory = async (req, res) => {
  try {
    const { name, subCategories, sortOrder } = req.body;

    if (!name) return res.json({ success: false, message: "Category name is required" });

    const exists = await categoryModel.findOne({ slug: slugify(name) });
    if (exists) return res.json({ success: false, message: "Category already exists" });

    let image = undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "categories");
      image = { url: result.secure_url, public_id: result.public_id };
    }

    const subs = (subCategories || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ name: s, slug: slugify(s) }));

    const category = await categoryModel.create({
      name,
      slug: slugify(name),
      subCategories: subs,
      image,
      sortOrder: Number(sortOrder) || 0,
    });

    res.status(201).json({ success: true, message: "Category added", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN — update name / subcategories / active flag / order
const updateCategory = async (req, res) => {
  try {
    const { id, name, subCategories, isActive, sortOrder } = req.body;

    const category = await categoryModel.findById(id);
    if (!category) return res.json({ success: false, message: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (subCategories !== undefined) {
      category.subCategories = subCategories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({ name: s, slug: slugify(s) }));
    }
    if (isActive !== undefined) category.isActive = isActive === "true" || isActive === true;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder) || 0;

    if (req.file) {
      if (category.image?.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }
      const result = await uploadToCloudinary(req.file.buffer, "categories");
      category.image = { url: result.secure_url, public_id: result.public_id };
    }

    await category.save();
    res.json({ success: true, message: "Category updated", category });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ADMIN — delete (blocked if products still use it)
const removeCategory = async (req, res) => {
  try {
    const { id } = req.body;

    const category = await categoryModel.findById(id);
    if (!category) return res.json({ success: false, message: "Category not found" });

    const inUse = await productModel.countDocuments({ category: category.name });
    if (inUse > 0) {
      return res.json({
        success: false,
        message: `Cannot delete: ${inUse} products still use this category`,
      });
    }

    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await categoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Category removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  listCategories,
  listAllCategories,
  addCategory,
  updateCategory,
  removeCategory,
};
