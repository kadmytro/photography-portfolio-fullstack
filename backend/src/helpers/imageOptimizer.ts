import sharp from "sharp";

export const optimizeImage = async (
  data: Buffer,
  width?: number,
  height?: number,
  quality: number = 80,
  blur: boolean = false
): Promise<Buffer> => {
  try {
    let image = sharp(data);

    if (width || height) {
      image = image.resize({
        width,
        height,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (blur) {
      image = image.blur();
    }

    return await image.jpeg({ quality }).toBuffer();
  } catch (error) {
    console.error("Error optimizing image:", error);
    throw new Error("Image optimization failed");
  }
};
