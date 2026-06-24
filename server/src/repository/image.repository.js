import prisma from "../db/prisma.js";
import {image_status} from "../generated/prisma/client.ts";


export async function addImageRecord(imageData) {
  return prisma.image.create({
    data: imageData,
  });
}

export async function getImageRecordById(id) {
  return prisma.image.findUnique({
    where: { id },
  });
}

export async function checkImageProcessed(id) {
    return prisma.image.findUnique({
        where: { id },
        select: { processed: true },
    });
}

export async function updateImageRecord(id, updateData) {
  return prisma.image.update({
    where: { id },
    data: updateData,
  });
}

export async function updateImageStatus(id, status) {
  return prisma.image.update({
    where: { id },
    data: { status },
  });
}

export async function updateProcessedImage(id, processedData) {
  return prisma.image.update({
    where: { id },
    data: processedData,
  });
}




export async function deleteStaleProcessedImages(timeframeInHours) {
  timeframeInHours = new Date(Date.now() - timeframeInHours * 60 * 60 * 1000);
  return prisma.image.deleteMany({
    where: {
      status: image_status.PROCESSED,
      updatedAt: {
        lte: timeframeInHours,
      },
    },
  });
}