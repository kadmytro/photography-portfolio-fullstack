import { Router } from "express";
import { AppDataSource } from "../data-source";
import { PhotoCategory } from "../entity/PhotoCategory";
import { checkAuth } from "./authMiddleware";
import { readSettings } from "../helpers/settingsReader";

const router = Router();

router.get("/get", async (req, res) => {
  const categories = await AppDataSource.getRepository(PhotoCategory).find();
  res.json(categories);
});

router.get("/categoriesToDisplay", async (req, res) => {
  const settings = await readSettings();
  const gallerySelectedCategories = settings?.gallerySelectedCategories;
  try {
    let categories = await AppDataSource.getRepository(PhotoCategory).find();

    if (
      Array.isArray(gallerySelectedCategories) &&
      gallerySelectedCategories.length > 0
    ) {
      console.log(gallerySelectedCategories);
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

router.post("/post", checkAuth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "No name provided" });
    }

    const category = new PhotoCategory();
    category.name = name;
    category.description = description;

    const categoryRepository = AppDataSource.getRepository(PhotoCategory);
    await categoryRepository.save(category);

    res.status(201).json(category.id);
  } catch (error) {
    console.error("Error saving photo:", error);
    res.status(500).json({ error: "Failed to save a new category" });
  }
});

router.put("/put/:id", checkAuth, async (req, res) => {
  const categoryRepository = await AppDataSource.getRepository(PhotoCategory);
  const category = await categoryRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (category) {
    categoryRepository.merge(category, req.body);
    const result = await categoryRepository.save(category);
    res.json(result);
  } else {
    res.status(404).send("Category not found");
  }
});

router.delete("/delete/:id", checkAuth, async (req, res) => {
  const categoryRepository = await AppDataSource.getRepository(PhotoCategory);
  const result = await categoryRepository.delete(req.params.id);

  if (result.affected) {
    res.status(204).send();
  } else {
    res.status(404).send("Category not found");
  }
});

export default router;
