import { imageQueue } from "./image.queue.js";

async function addImageToQueue(imageId) {
  return imageQueue.add(
    "image-processing",
    {
      imageId,
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 2000,
      },

      removeOnComplete: {
        age: 100,
      },

      removeOnFail: {
        age: 100,
      },
    }
  );
}

export default addImageToQueue;