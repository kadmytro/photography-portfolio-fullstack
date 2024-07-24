import express from "express";
import cors from 'cors';
import photoRouter from "./api/photo";
import categoryRouter from "./api/photoCategory";
import { AppDataSource } from "./data-source";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    // Routes
    app.use("/api/photos", photoRouter);
    app.use("/api/categories", categoryRouter);

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));