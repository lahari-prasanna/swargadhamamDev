const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "swargadhamamDev",
    allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
  },
});

// Separate storage for testimonials (video support)
const testimonialStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "swargadhamamDev/testimonials",
    resource_type: "auto", // VERY IMPORTANT for videos
    allowed_formats: ["mp4", "mov", "webm"],
    transformation: [
      { width: 720, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

module.exports = {
  cloudinary,
  storage,
  testimonialStorage,
};
