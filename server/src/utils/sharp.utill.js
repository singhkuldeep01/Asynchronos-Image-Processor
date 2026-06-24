import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const OUTPUT_DIR = "processed";

async function ensureOutputDirectory() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

export async function processImage(imagePath, fileName, job) {
  await ensureOutputDirectory();

  const baseName = path.parse(fileName).name;

  const thumbnailPath = `${OUTPUT_DIR}/${baseName}-thumb.jpg`;
  const mediumPath = `${OUTPUT_DIR}/${baseName}-medium.jpg`;
  const largePath = `${OUTPUT_DIR}/${baseName}-large.jpg`;
  const webpPath = `${OUTPUT_DIR}/${baseName}.webp`;
  const avifPath = `${OUTPUT_DIR}/${baseName}.avif`;

  const image = sharp(imagePath);

  const metadata = await image.metadata();

  await Promise.all([
    await job.updateProgress(20),
    await image
      .clone()
      .resize(150, 150)
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath),

    await job.updateProgress(30),
    await image
      .clone()
      .resize(600)
      .jpeg({ quality: 85 })
      .toFile(mediumPath),

    await job.updateProgress(40),
    await image
      .clone()
      .resize(1200)
      .jpeg({ quality: 90 })
      .toFile(largePath),

    await job.updateProgress(60),
    await image
      .clone()
      .webp({ quality: 80 })
      .toFile(webpPath),
    await job.updateProgress(80),
    await image
      .clone()
      .avif({ quality: 60 })
      .toFile(avifPath),
    await job.updateProgress(100),
  ]);

  return {
    metadata,
    thumbnailPath,
    mediumPath,
    largePath,
    webpPath,
    avifPath,
  };
}