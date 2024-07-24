import { Router } from 'express';
import multer from 'multer';
import { AppDataSource } from '../data-source';
import { Photo } from '../entity/Photo';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo).find();
  res.json(photos);
});

router.get('/recent', async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo)
    .createQueryBuilder('photo')
    .orderBy('photo.id', 'DESC')
    .limit(20)
    .getMany();
  res.json(photos.map(p => p.getPhotoMetadata()));
});

router.get('/byCategory/:categoryId', async (req, res) => {
  const photos = await AppDataSource.getTreeRepository(Photo)
    .createQueryBuilder('photo')
    .where(':categoryId = ANY(photo.categoriesIds)', { categoryId: parseInt(req.params.categoryId) })
    .orderBy('photo.id', 'DESC')
    .limit(20)
    .getMany();
  res.json(photos.map(p => p.getPhotoMetadata()));
});

router.get('/:id', async (req, res) => {
  try {
    const photo = await AppDataSource.getRepository(Photo).findOneBy({ id: parseInt(req.params.id) });
    if (!photo) {
      return res.status(404).send('Photo not found');
    }

    const imageBuffer = photo.photo;
    
    res.set('Content-Type', photo.mimeType);

    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching photo', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/date/:date', async (req, res) => {
  const photos = await AppDataSource.getRepository(Photo).findBy({ date: new Date(req.params.date) });
  res.json(photos);
});

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { caption, location, date, categories, width, height, mimeType } = req.body;
    const data = req.file?.buffer;

    if (!data) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!categories) {
      return res.status(400).json({ error: 'No category chosen' });
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
    console.error('Error saving photo:', error);
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

export default router;
