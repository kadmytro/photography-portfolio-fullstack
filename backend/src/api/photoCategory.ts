import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { PhotoCategory } from '../entity/PhotoCategory';

const router = Router();

router.get("/get", async (req, res) => {
    const categories = await AppDataSource.getRepository(PhotoCategory).find();
    res.json(categories);
  });

router.post("/post", async (req, res) => {
    try {
      const { name, description } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: 'No name provided' });
      }
  
      const category = new PhotoCategory();
      category.name = name;
      category.description = description;
  
      const categoryRepository = AppDataSource.getRepository(PhotoCategory);
      await categoryRepository.save(category);
  
      res.status(201).json(category.id);
    } catch (error) {
      console.error('Error saving photo:', error);
      res.status(500).json({ error: 'Failed to save a new category' });
    }
});

router.put("put/:id", async (req, res) => {
    const categoryRepository = await AppDataSource.getRepository(PhotoCategory);
    const category = await AppDataSource.getRepository(PhotoCategory).findOneBy({ id: parseInt(req.params.id) });

    if (category) {
        categoryRepository.merge(category, req.body);
        const result = await categoryRepository.save(category);
        res.json(result);
    } else {
        res.status(404).send("Category not found");
      }
});

router.delete("/delete/:id", async (req, res) => {
    const categoryRepository = await AppDataSource.getRepository(PhotoCategory);
    const result = await categoryRepository.delete(req.params.id);

    if (result.affected) {
        res.status(204).send();
    } else {
      res.status(404).send("Category not found");
    }

});

export default router;
