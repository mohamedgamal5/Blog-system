const cloudinary = require("cloudinary").v2;

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "dd8nvigr2",
  api_key: "222118299724841",
  api_secret: "c5QdK0X2lsUt0oSwoNXv0IsbrX8",
});
//CloudinaryUploadImage

const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(`internal Server Error cloudinary`);
  }
};

//CloudinaryRemoveImage

const cloudinaryRemoveImage = async (imagePblicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePblicId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`internal Server delete Error cloudinary`);
  }
};

//CloudinaryRemoveMultiImage

const cloudinaryRemoveMultiImage = async (imagePblicIds) => {
  try {
    imagePblicIds.forEach((publicId) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error(
            `Error deleting image with public ID ${publicId}:`,
            error
          );
        } else {
          console.log(`Image with public ID ${publicId} deleted successfully`);
        }
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error(`internal Server Error cloudinary`);
  }
};
module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultiImage,
};
