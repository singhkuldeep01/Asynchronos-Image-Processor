import { deleteStaleProcessedImages } from "../repository/image.repository.js";

export async function cleanUpProcessedImages() {
  const images = await deleteStaleProcessedImages(1); // Delete images processed more than 1 hour ago in DB
  console.log(`Cleaned up ${images.count} stale processed images.`);
   for (const image of images) {
    try {
      // Delete original upload
      await fs.unlink(path.join(process.cwd(), image.originalPath));

      // Delete processed variants
      await fs.unlink(path.join(process.cwd(), image.thumbnailPath));
      await fs.unlink(path.join(process.cwd(), image.mediumPath));
      await fs.unlink(path.join(process.cwd(), image.largePath));
      await fs.unlink(path.join(process.cwd(), image.webpPath));
      await fs.unlink(path.join(process.cwd(), image.avifPath));

      // Delete DB record
      await deleteImage(image.id);

      console.log(`Deleted image ${image.id}`);
    } catch (err) {
      console.error(`Failed to cleanup image ${image.id}`, err);
    }
  }
}