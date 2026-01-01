const cloudinary = require("cloudinary").v2;
const productModel = require("../models/ProductModel");

const addproduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller
    } = req.body;

    console.log("req.files:", req.files);

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No images uploaded"
      });
    }

    const imagesUrls = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image"
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrls,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    return res.json({
      success: true,
      msg: "Product added successfully",
      urls: imagesUrls
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: error.message
    });
  }
};


const listproduct = async(req, res) => {
  try{
    const products = await productModel.find({});
    res.json({success:true , products})
  }
  catch (error){
  console.log(error)
   res.json("error in product list")
  }

}


const removeproduct = async(req, res) => {
  await productModel.findByIdAndDelete(req.body.id)
  res.json({success:true , message:"product removed"})

}

const singleproduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required"
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
  addproduct,
  listproduct,
  removeproduct,
  singleproduct
};
