import "reflect-metadata";
import sharp from "sharp";
import { AppDataSource } from "../data-source";
import { Photo } from "../entity/Photo";

async function optimizeExistingPhotos() {
  try {
    await AppDataSource.initialize();
    const photoRepository = AppDataSource.getRepository(Photo);
    const photos = await photoRepository.find();

    console.log(`Processing ${photos.length} photos...`);

    for (const photo of photos) {
      if (photo.photoMobile && photo.photoBlurred) {
        console.log(`Photo ${photo.id} already optimized, skipping...`);
        continue;
      }
      const originalPhoto = photo.photo;

      const metadata = await sharp(originalPhoto).metadata();

      const isLandscape =
        metadata.width && metadata.height && metadata.width > metadata.height;

      const shouldResize = () => {
        return (
          (isLandscape && metadata.width && metadata.width > 2500) ||
          (!isLandscape && metadata.height && metadata.height > 1600)
        );
      };

      const highQualityImageBuffer = !shouldResize()
        ? originalPhoto
        : await sharp(originalPhoto)
            .resize({
              width: isLandscape ? 2500 : undefined,
              height: !isLandscape ? 1600 : undefined,
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 80 })
            .toBuffer();

      const highQualityImageMetadata = await sharp(
        highQualityImageBuffer
      ).metadata();

      const mobileOptimizedImageBuffer = await sharp(originalPhoto)
        .resize({
          width: isLandscape ? 1024 : undefined,
          height: !isLandscape ? 1024 : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const blurredCoverImageBuffer = await sharp(originalPhoto)
        .resize({
          width: isLandscape ? 20 : undefined,
          height: !isLandscape ? 20 : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
        .blur()
        .jpeg({ quality: 30 })
        .toBuffer();

      photo.photo = highQualityImageBuffer;
      photo.width = highQualityImageMetadata.width ?? 2500;
      photo.height = highQualityImageMetadata.height ?? 1600;

      photo.photoMobile = mobileOptimizedImageBuffer;

      photo.photoBlurred = blurredCoverImageBuffer;

      await photoRepository.save(photo);

      console.log(`Photo ${photo.id} optimized with dimensions and saved.`);
    }

    console.log("All photos have been processed.");
  } catch (error) {
    console.error("Error processing photos:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

optimizeExistingPhotos();
