import { Router } from "express";
import multer from "multer";
import { AppDataSource } from "../data-source";
import { Photo } from "../entity/Photo";
import { checkAuth } from "./authMiddleware";
import sharp from "sharp";
import { PhotoCategory } from "../entity/PhotoCategory";
import { In } from "typeorm";
import { getSetting } from "../helpers/setttingsService";
import { optimizeImage } from "../helpers/imageOptimizer";

const router = Router();
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get("/", async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo).find({
    relations: ["categories"],
  });
  res.json(photos);
});

router.get("/recent", async (req, res) => {
  const settings = await getSetting("gallerySettings");
  const homeMaxPhotos = settings?.homeMaxPhotos ?? 50;

  try {
    const photos = await AppDataSource.getRepository(Photo)
      .createQueryBuilder("photo")
      .leftJoinAndSelect("photo.categories", "category")
      .orderBy("photo.id", "DESC")
      .limit(homeMaxPhotos)
      .getMany();

    res.json(photos.map((p) => p.getPhotoMetadata()));
  } catch (error) {
    console.error("Failed to fetch recent photos:", error);
    res.status(500).json({ error: "Failed to fetch recent photos" });
  }
});

router.get("/all", async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo)
    .createQueryBuilder("photo")
    .leftJoinAndSelect("photo.categories", "category")
    .orderBy("photo.id", "DESC")
    .getMany();
  res.json(photos.map((p) => p.getPhotoMetadata()));
});

router.get("/byCategories/:categoryIds", async (req, res) => {
  try {
    const categoryIds = req.params.categoryIds
      .split(",")
      .map((id) => parseInt(id));

    const categories = await AppDataSource.getRepository(PhotoCategory)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.photos", "photo")
      .where("category.id IN (:...categoryIds)", { categoryIds })
      .getMany();

    const photos = categories.flatMap((category) => category.photos);

    res.json(photos.map((p) => p.getPhotoMetadata()));
  } catch (error) {
    console.error("Failed to fetch photos by categories:", error);
    res.status(500).json({ error: "Failed to fetch photos by categories" });
  }
});

router.get("/byCategory/:categoryId", async (req, res) => {
  const settings = await getSetting("gallerySettings");
  const galleryMaxPhotos = settings?.galleryMaxPhotos ?? 100;

  try {
    const categoryId = parseInt(req.params.categoryId);
    const category = await AppDataSource.getRepository(PhotoCategory)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.photos", "photo")
      .where("category.id = :categoryId", { categoryId })
      .getOne();

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const photos = category.photos.slice(0, galleryMaxPhotos);
    res.json(photos.map((p) => p.getPhotoMetadata()));
  } catch (error) {
    console.error("Failed to fetch photos by category:", error);
    res.status(500).json({ error: "Failed to fetch photos by category" });
  }
});

router.get("/:id/:optimized?", async (req, res) => {
  try {
    const photoId = parseInt(req.params.id);
    const optimized = req.params.optimized || "none";

    const photo = await AppDataSource.getRepository(Photo).findOneBy({
      id: photoId,
    });

    if (!photo) {
      return res.status(404).send("Photo not found");
    }

    let imageBuffer: Buffer;
    let mimeType: string = photo.mimeType;

    switch (optimized) {
      case "mobile":
        if (photo.photoMobile) {
          imageBuffer = photo.photoMobile;
        } else {
          return res.status(404).send("Mobile-optimized version not found");
        }
        break;
      case "small":
        if (photo.photoBlurred) {
          imageBuffer = photo.photoBlurred;
        } else {
          return res.status(404).send("Small version not found");
        }
        break;
      case "none":
      default:
        imageBuffer = photo.photo;
        break;
    }

    res.set("Content-Type", mimeType);

    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/date/:date", async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo).findBy({
    date: new Date(req.params.date),
  });
  res.json(photos);
});

router.put("/:id", checkAuth, upload.single("photo"), async (req, res) => {
  const { caption, location, date, categories, mimeType, height, width } =
    req.body;
  const data = req.file?.buffer;
  const [maxWidth, maxHeight] = [2500, 1600];
  const photoRepository = await AppDataSource.getRepository(Photo);
  const categoryRepository = await AppDataSource.getRepository(PhotoCategory);

  try {
    const photo = await photoRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["categories"],
    });

    if (!photo) {
      return res.status(404).send("Photo not found");
    }

    if (categories) {
      const categoryIds = JSON.parse(categories);
      const photoCategories = await AppDataSource.getRepository(PhotoCategory)
        .createQueryBuilder("category")
        .where("category.id IN (:...categoryIds)", { categoryIds })
        .getMany();
      photo.categories = photoCategories;
    }

    photo.caption = caption ?? photo.caption;
    photo.location = location ?? photo.location;
    photo.date = date ? new Date(date) : photo.date;
    photo.mimeType = mimeType ?? photo.mimeType;

    if (data) {
      const metadata = await sharp(data).metadata();

      const isLandscape =
        metadata.width && metadata.height && metadata.width > metadata.height;

      const shouldResize = () => {
        return (
          (isLandscape && metadata.width && metadata.width > maxWidth) ||
          (!isLandscape && metadata.height && metadata.height > maxHeight)
        );
      };

      const highQualityImage = !shouldResize()
        ? data
        : await sharp(data)
            .resize({
              width: isLandscape ? 2500 : undefined,
              height: !isLandscape ? 1600 : undefined,
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 80 })
            .toBuffer();

      const highQualityImageMetadata = await sharp(highQualityImage).metadata();
      photo.photo = highQualityImage;
      photo.photoMobile = null;
      photo.photoBlurred = null;
      photo.height = highQualityImageMetadata.height ?? height;
      photo.width = highQualityImageMetadata.width ?? width;

      await photoRepository.save(photo);

      process.nextTick(async () => {
        try {
          // Mobile version
          const mobileOptimizedImage = await optimizeImage(
            data,
            isLandscape ? 1024 : undefined,
            !isLandscape ? 1024 : undefined,
            80
          );
          photo.photoMobile = mobileOptimizedImage;

          // Thumbnail version
          const blurredCoverImage = await optimizeImage(
            data,
            isLandscape ? 100 : undefined,
            !isLandscape ? 100 : undefined,
            30,
            true
          );
          photo.photoBlurred = blurredCoverImage;

          // Update photo record with mobile and blurred images
          await photoRepository.save(photo);
        } catch (err) {
          console.error("Error optimizing mobile/thumbnail images:", err);
        }
      });

      res.json("Successfully updated the photo");
    } else {
      await photoRepository.save(photo);
      res.json("Successfully updated the photo");
    }
  } catch (error) {
    console.error("Failed to update the photo:", error);
    res.status(500).json({ error: "Failed to update the photo" });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  const photoRepository = await AppDataSource.getRepository(Photo);
  const result = await photoRepository.delete(req.params.id);

  if (result.affected) {
    res.status(204).send();
  } else {
    res.status(404).send("Photo not found");
  }
});

router.post("/", checkAuth, upload.single("photo"), async (req, res) => {
  try {
    const { caption, location, date, categories, mimeType, height, width } =
      req.body;
    const data = req.file?.buffer;
    const [maxWidth, maxHeight] = [2500, 1600];

    if (!data) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!categories) {
      return res.status(400).json({ error: "No category chosen" });
    }

    const photo = new Photo();
    photo.caption = caption;
    photo.location = location;
    photo.date = date ? new Date(date) : null;
    photo.mimeType = mimeType;
    if (categories) {
      const categoryIds = JSON.parse(categories);
      const photoCategories = await AppDataSource.getRepository(PhotoCategory)
        .createQueryBuilder("category")
        .where("category.id IN (:...categoryIds)", { categoryIds })
        .getMany();

      photo.categories = photoCategories;
    }

    const metadata = await sharp(data).metadata();
    const isLandscape =
      metadata.width && metadata.height && metadata.width > metadata.height;

    const shouldResize = () => {
      return (
        (isLandscape && metadata.width && metadata.width > maxWidth) ||
        (!isLandscape && metadata.height && metadata.height > maxHeight)
      );
    };

    const highQualityImage = !shouldResize()
      ? data
      : await optimizeImage(
          data,
          isLandscape ? 2500 : undefined,
          !isLandscape ? 1600 : undefined,
          80
        );

    const highQualityImageMetadata = await sharp(highQualityImage).metadata();

    photo.photo = highQualityImage;
    photo.height = highQualityImageMetadata.height ?? height;
    photo.width = highQualityImageMetadata.width ?? width;
    const photoRepository = AppDataSource.getRepository(Photo);
    await photoRepository.save(photo);

    process.nextTick(async () => {
      try {
        // Mobile version
        const mobileOptimizedImage = await optimizeImage(
          data,
          isLandscape ? 1024 : undefined,
          !isLandscape ? 1024 : undefined,
          80
        );
        photo.photoMobile = mobileOptimizedImage;

        // Thumbnail version
        const blurredCoverImage = await optimizeImage(
          data,
          isLandscape ? 100 : undefined,
          !isLandscape ? 100 : undefined,
          30,
          true
        );
        photo.photoBlurred = blurredCoverImage;

        // Update photo record with mobile and blurred images
        await photoRepository.save(photo);
      } catch (err) {
        console.error("Error optimizing mobile/thumbnail images:", err);
      }
    });

    res.status(201).json(photo.id);
  } catch (error) {
    console.error("Error saving photo:", error);
    res.status(500).json({ error: "Failed to save photo" });
  }
});

export default router;
