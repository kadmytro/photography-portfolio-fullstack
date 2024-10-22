import { Router } from "express";
import fs, { link } from "fs";
import path from "path";
import { AppDataSource } from "../data-source";
import { PhotoCategory } from "../entity/PhotoCategory";
import { checkAuth } from "./authMiddleware";
import { readSettings } from "../helpers/settingsReader";

const router = Router();

router.get("/", async (req, res) => {
  const categories = await AppDataSource.getRepository(PhotoCategory).find({
    order: { ordinal: "ASC" },
  });
  res.json(categories);
});

router.get("/categoriesToDisplay", async (req, res) => {
  const settings = await readSettings();
  const gallerySelectedCategories = settings?.gallerySelectedCategories;
  try {
    let categories = await AppDataSource.getRepository(PhotoCategory).find({
      order: { ordinal: "ASC" },
    });

    if (
      Array.isArray(gallerySelectedCategories) &&
      gallerySelectedCategories.length > 0
    ) {
      categories = categories.filter((category) =>
        gallerySelectedCategories.includes(category.id)
      );
    }

    res.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/", checkAuth, async (req, res) => {
  try {
    const { name, description, ordinal } = req.body;

    if (!name) {
      return res.status(400).json({ error: "No name provided" });
    }

    const category = new PhotoCategory();
    category.name = name;
    category.description = description;
    category.ordinal = ordinal === "" ? null : ordinal;

    const categoryRepository = AppDataSource.getRepository(PhotoCategory);
    await categoryRepository.save(category);

    res.status(201).json(category.id);
  } catch (error) {
    console.error("Error saving photo:", error);
    res.status(500).json({ error: "Failed to save a new category" });
  }
});

router.put("/:id", checkAuth, async (req, res) => {
  const categoryRepository = await AppDataSource.getRepository(PhotoCategory);
  const category = await categoryRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (category) {
    const updatedData = {
      ...req.body,
      ordinal:
        req.body.ordinal === "" || req.body.ordinal === "null"
          ? null
          : req.body.ordinal,
    };
    categoryRepository.merge(category, updatedData);
    await categoryRepository.save(category);
    res.json("Successfully updated the category");
  } else {
    res.status(404).send("Category not found");
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  const categoryRepository = AppDataSource.getRepository(PhotoCategory);

  try {
    const categoryId = parseInt(req.params.id);

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['photos'],
    });

    if (!category) {
      return res.status(404).send("Category not found");
    }

    if (category.photos && category.photos.length > 0) {
      category.photos = [];
      await categoryRepository.save(category);
    }
    const result = await categoryRepository.delete(categoryId);
    const settings = await readSettings();
    const gallerySelectedCategories = settings?.gallerySelectedCategories;
    if (gallerySelectedCategories?.includes(categoryId) && settings) {
      const settingsFilePath = path.join(__dirname, "..", "config", "settings.json");
      settings.gallerySelectedCategories = gallerySelectedCategories.filter((id) => id != categoryId);
      
      fs.writeFile(
        settingsFilePath,
        JSON.stringify(settings, null, 2),
        "utf8",
        (err) => {}
      );
    }

    if (result.affected) {
      res.status(204).send();
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.error("Failed to delete category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
