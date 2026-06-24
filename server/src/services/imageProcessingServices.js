import { processImage } from "../utils/sharp.utill.js";


import {
  updateImageStatus,
  updateProcessedImage,
    getImageRecordById,
} from "../repository/image.repository.js";

async function processUploadedImage(job) {
  
  const { imageId } = job.data;

    console.log("Processing image: ", imageId);
    const image = await getImageRecordById(imageId);
  try {



    await updateImageStatus(imageId, "PROCESSING");

    await job.updateProgress(10);

    const processed = await processImage(image.originalPath, image.originalName , job);


    await updateProcessedImage(imageId, {
      thumbnailPath: processed.thumbnailPath,
      mediumPath: processed.mediumPath,
      largePath: processed.largePath,
      webpPath: processed.webpPath,
      avifPath: processed.avifPath,
      status: "COMPLETED",
    });



    return processed;
  } catch (err) {
    await updateImageStatus(imageId, "FAILED");
    throw err;
  }
}

export default processUploadedImage;