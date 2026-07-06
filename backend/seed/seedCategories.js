// run once:  node seed/seedCategories.js
// creates the full Meesho-style category tree
require("dotenv").config();
const mongoose = require("mongoose");
const categoryModel = require("../models/CategoryModel");

const slugify = (t) =>
  t.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CATEGORIES = [
  { name: "Kurti, Saree & Lehenga", subs: ["Kurtis", "Sarees", "Lehengas", "Dupattas", "Blouses"] },
  { name: "Women Western", subs: ["Topwear", "Bottomwear", "Dresses", "Jumpsuits", "Winterwear"] },
  { name: "Lingerie", subs: ["Bras", "Briefs", "Nightwear", "Shapewear"] },
  { name: "Men", subs: ["Topwear", "Bottomwear", "Winterwear", "Ethnic Wear", "Innerwear"] },
  { name: "Kids & Toys", subs: ["Boys Clothing", "Girls Clothing", "Baby Care", "Toys & Games"] },
  { name: "Home & Kitchen", subs: ["Home Decor", "Kitchenware", "Bedsheets", "Curtains", "Storage"] },
  { name: "Beauty & Health", subs: ["Makeup", "Skincare", "Haircare", "Personal Care", "Wellness"] },
  { name: "Jewellery & Accessories", subs: ["Earrings", "Necklaces", "Bangles", "Rings", "Hair Accessories"] },
  { name: "Bags & Footwear", subs: ["Handbags", "Backpacks", "Men Footwear", "Women Footwear", "Kids Footwear"] },
  { name: "Electronics", subs: ["Mobile Accessories", "Headphones", "Smart Watches", "Home Appliances"] },
  { name: "Watches", subs: ["Men Watches", "Women Watches", "Kids Watches"] },
  { name: "Sports & Fitness", subs: ["Gym Equipment", "Sportswear", "Yoga", "Outdoor Sports"] },
  { name: "Car & Motorbike", subs: ["Car Accessories", "Bike Accessories", "Helmets"] },
  { name: "Office Supplies & Stationery", subs: ["Pens & Writing", "Notebooks", "Office Electronics", "Art Supplies"] },
  { name: "Grocery", subs: ["Snacks", "Beverages", "Staples", "Dry Fruits"] },
  { name: "Books", subs: ["Fiction", "Non Fiction", "Academic", "Children Books"] },
  { name: "Pet Supplies", subs: ["Dog Supplies", "Cat Supplies", "Pet Food", "Pet Toys"] },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected");

  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await categoryModel.updateOne(
      { slug: slugify(c.name) },
      {
        $set: {
          name: c.name,
          slug: slugify(c.name),
          subCategories: c.subs.map((s) => ({ name: s, slug: slugify(s) })),
          isActive: true,
          sortOrder: i,
        },
      },
      { upsert: true }
    );
    console.log("✔", c.name);
  }

  console.log("All categories seeded ✅");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
