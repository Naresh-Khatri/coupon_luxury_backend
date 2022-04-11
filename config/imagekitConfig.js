import ImageKit from "imagekit";

const imageKit = new ImageKit({
  publicKey: "public_OHuFh984ue83eD5OPwMZG4WEBr8=",
  privateKey: "private_FucxFKOEAQI4yzAcpYCvKWSRnFU=",
  urlEndpoint: "https://ik.imagekit.io/couponluxury",
});

export const removeImgFromImageKit = (imageName) => {
  return new Promise(async (resolve, reject) => {
    try {
      //find the image in imageKit
      const images = await imageKit.listFiles({ name: imageName });
      console.log(images);
      //if there is an image, delete it
      if (images.length > 0){
        const deletedImg = await imageKit.deleteFile(images[0].fileId);
        console.log('deletedImg', deletedImg);
      } 
      resolve();
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

export default imageKit;
