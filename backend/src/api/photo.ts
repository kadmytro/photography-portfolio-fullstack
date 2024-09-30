import { Router } from "express";
import multer from "multer";
import { AppDataSource } from "../data-source";
import { Photo } from "../entity/Photo";
import { checkAuth } from "./authMiddleware";
import { readSettings } from "../helpers/settingsReader";

const router = Router();
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get("/", async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo).find();
  res.json(photos);
});

router.get("/recent", async (req, res) => {
  const settings = await readSettings();
  const homeMaxPhotos = settings?.homeMaxPhotos ?? 50;

  try {
    const photos = await AppDataSource.getRepository(Photo)
      .createQueryBuilder("photo")
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
    .orderBy("photo.id", "DESC")
    .getMany();
  res.json(photos.map((p) => p.getPhotoMetadata()));
});

router.get("/byCategories/:categoryIds", async (req, res) => {
  const categoryIds = req.params.categoryIds
    .split(",")
    .map((id) => parseInt(id));

  const photos = await AppDataSource.getTreeRepository(Photo)
    .createQueryBuilder("photo")
    .where("photo.categoriesIds && :categoryIds", {
      categoryIds,
    })
    .orderBy("photo.id", "DESC")
    .getMany();

  res.json(photos.map((p) => p.getPhotoMetadata()));
});

router.get("/byCategory/:categoryId", async (req, res) => {
  const settings = await readSettings();
  const galleryMaxPhotos = settings?.galleryMaxPhotos ?? 100;

  try {
    const photos = await AppDataSource.getRepository(Photo)
      .createQueryBuilder("photo")
      .where(":categoryId = ANY(photo.categoriesIds)", {
        categoryId: parseInt(req.params.categoryId),
      })
      .orderBy("photo.id", "DESC")
      .limit(galleryMaxPhotos)
      .getMany();

    res.json(photos.map((p) => p.getPhotoMetadata()));
  } catch (error) {
    console.error("Failed to fetch photos by category:", error);
    res.status(500).json({ error: "Failed to fetch photos by category" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const photo = await AppDataSource.getRepository(Photo).findOneBy({
      id: parseInt(req.params.id),
    });
    if (!photo) {
      return res.status(404).send("Photo not found");
    }
    const imageBuffer = photo.photo;

    res.set("Content-Type", photo.mimeType);

    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching photo", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/date/:date", async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo).findBy({
    date: new Date(req.params.date),
  });
  res.json(photos);
});

router.put("/:id", checkAuth, async (req, res) => {
  const photoRepository = await AppDataSource.getRepository(Photo);
  const photo = await photoRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (photo) {
    photoRepository.merge(photo, req.body);
    const result = await photoRepository.save(photo);
    res.json("Successfully updated the photo");
  } else {
    res.status(404).send("Photo not found");
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
    const { caption, location, date, categories, width, height, mimeType } =
      req.body;
    const data = req.file?.buffer;

    if (!data) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!categories) {
      return res.status(400).json({ error: "No category chosen" });
    }

    const photo = new Photo();
    photo.caption = caption;
    photo.location = location;
    photo.categoriesIds = JSON.parse(categories);
    photo.date = date ? new Date(date) : null;
    photo.photo = data;
    photo.width = width;
    photo.height = height;
    photo.mimeType = mimeType;

    const photoRepository = AppDataSource.getRepository(Photo);
    await photoRepository.save(photo);

    res.status(201).json(photo.id);
  } catch (error) {
    console.error("Error saving photo:", error);
    res.status(500).json({ error: "Failed to save photo" });
  }
});

export default router;
