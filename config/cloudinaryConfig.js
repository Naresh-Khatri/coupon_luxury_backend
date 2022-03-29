import cloudinarySDK from "cloudinary";
const cloudinary = cloudinarySDK.v2;
//config cloudinary with url
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary
