import 'dotenv/config'
import debug from "debug";
import config from "config"
import express from "express"
import mongoose from "mongoose"
import morgan from "morgan";
import { verifyUser } from './middlewares/authMiddlewares';
import cookieParser from 'cookie-parser';
import authRouters from "./routes/authRoutes"
import itemRouters from "./routes/itemRoutes"
import { errorDegugger } from './controllers/authControllers';
import auctionRoutes from "./routes/auctionRoutes"
import { startsocketServer } from './websockets/socketServer';

const app = express();
const startupDebugger = debug("app:startup");
const dbDebugger = debug("app:dbDebugger")

if (app.get("env") === "development") {
  app.use(morgan("dev"));
  startupDebugger("DEVELOPMENT ENVIRONEMNT ....\nMORGAN ACTIVE...")
}

app.use(cookieParser("token"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/auth", authRouters)
app.use("/items", verifyUser, itemRouters)
app.use("/auction", verifyUser, auctionRoutes)

const connectToDb = async () => {
  try {
    await mongoose.connect(config.get("mongoDbConnectionURL"));
    dbDebugger("Connected To Db")
    app.listen(PORT, () => startupDebugger(`HTTP server is listening to requests at ${PORT}`));
  } catch (error: any) {
    startupDebugger(error.message)
  }
}

connectToDb();

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorDegugger(err.message);
  errorDegugger(err.stack);
  res.status(500).json({
    message: "Something Went Wrong"
  });
});

app.get("/test", (req: express.Request, res: express.Response) => {
  res.send("Ok")
})

startsocketServer()

const PORT = config.get("AppPort");