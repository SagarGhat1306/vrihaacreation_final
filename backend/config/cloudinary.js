// const cloudinary = require("cloudinary").v2;

// const connectCloudinary = () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY
//   });

//   console.log(cloud_name)
//   console.log(api_key)
//   console.log(api_secret)

//   console.log("Cloudinary connected ✅");
// };

// module.exports = connectCloudinary;


const cloudinary = require("cloudinary").v2;

const connectCloudinary = () => {
  console.log("ENV CHECK 👉", {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
    api_secret: process.env.CLOUDINARY_SECRET_KEY ? "OK" : "MISSING"
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  });

  console.log("Cloudinary connected ✅");
};

module.exports = connectCloudinary;
