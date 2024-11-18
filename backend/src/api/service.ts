import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Service } from "../entity/Service";
import { checkAuth } from "./authMiddleware";
import multer from "multer";
import { optimizeImage } from "../helpers/imageOptimizer";

const router = Router();
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get("/", async (req, res) => {
  const services = await AppDataSource.getRepository(Service).find({
    order: { ordinal: "ASC" },
  });
  res.json(services.map((s) => s.getServiceDetails()));
});

router.get("/active", async (req, res) => {
  try {
    const activeServices = await AppDataSource.getRepository(Service).find({
      where: { isActive: true },
      order: { ordinal: "ASC" },
    });

    res.json(activeServices.map((s) => s.getServiceDetails()));
  } catch (error) {
    console.error("Error fetching active services:", error);
    res.status(500).json({ error: "Failed to fetch active services" });
  }
});

router.get("/image/:id", async (req, res) => {
  try {
    const service = await AppDataSource.getRepository(Service).findOneBy({
      id: parseInt(req.params.id),
    });
    if (!service) {
      return res.status(404).send("Service not found");
    }

    const imageBuffer = service.image;

    res.set("Content-Type", "image/jpeg");

    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching service image", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", upload.single("image"), checkAuth, async (req, res) => {
  const serviceRepository = await AppDataSource.getRepository(Service);
  const data = req.file?.buffer;
  const service = await serviceRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (service) {
    let optimizedImage = service.image;
    if (data) {
      optimizedImage = await optimizeImage(data, 1024, undefined, 80);
    }
    const updatedData = {
      ...req.body,
      ordinal:
        req.body.ordinal === "" || req.body.ordinal === "null"
          ? null
          : req.body.ordinal,
      isActive:
        req.body.isActive !== undefined
          ? JSON.parse(req.body.isActive)
          : undefined,
      image: optimizedImage,
    };
    serviceRepository.merge(service, updatedData);
    await serviceRepository.save(service);
    res.json("Successfully updated the service");
  } else {
    res.status(404).send("Service not found");
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  const serviceRepository = await AppDataSource.getRepository(Service);

  const result = await serviceRepository.delete(req.params.id);

  if (result.affected) {
    res.status(204).send();
  } else {
    res.status(404).send("Service not found");
  }
});

router.post("/", checkAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, isActive, ordinal } = req.body;
    const data = req.file?.buffer;
    console.log(req.body);

    if (!data) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const optimizedImage = await optimizeImage(data, 1024, undefined, 80);

    const service = new Service();
    service.title = title;
    service.description = description;
    service.price = price;
    service.image = optimizedImage;
    service.isActive = JSON.parse(isActive);
    service.ordinal = ordinal === "" ? null : ordinal;

    const serviceRepository = AppDataSource.getRepository(Service);
    await serviceRepository.save(service);

    res.status(201).json(service.id);
  } catch (error) {
    console.error("Error saving service:", error);
    res.status(500).json({ error: "Failed to save a service" });
  }
});

export default router;
