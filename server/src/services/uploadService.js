import { addImageRecord } from "../repository/image.repository.js";
import addImageToQueue from "../queues/image.producer.js";

async function uploadImage(file) {
  if (!file) {
    throw new Error("Image file is required.");
  }

  const image = await addImageRecord({
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: BigInt(file.size),
    originalPath: file.path,
  });

  const job = await addImageToQueue(image.id);

  return {
    imageId: image.id,
    jobId: job.id,
  };
}

export default uploadImage;