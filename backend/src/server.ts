import express from "express";
import cors from 'cors';
import photoRouter from "./api/photo";
import categoryRouter from "./api/photoCategory";
import adminRouter from "./api/admin"
import authRouter from "./api/auth";
import detailsRouter from "./api/details";
import { AppDataSource } from "./data-source";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


AppDataSource.initialize()
  .then(() => {
    
    app.use("/api/photos", photoRouter);
    app.use("/api/categories", categoryRouter);
    app.use('/auth', authRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/details', detailsRouter);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));