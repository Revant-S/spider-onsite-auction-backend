import 'dotenv/config'
import debug from "debug";
import config from "config"
import express from "express"
import mongoose from "mongoose"
import morgan from "morgan";
import path from 'path';
import cookieParser from 'cookie-parser';
import authRouters from "./routes/authRoutes"
const app = express();
const startupDebugger = debug("app:startup");
const dbDebugger = debug("app:dbDebugger")


app.set("view engine" , "ejs");
app.set('views', path.resolve(__dirname, '../client/views'));
app.use(cookieParser("token"))
app.use(express.static((path.join(__dirname, '../../public'))));
// app.use(express.static(path.join(__dirname, '../../public')));
// console.log((path.join(__dirname, '../../public')));



app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/auth",authRouters)
if (app.get("env") === "development") {
    app.use(morgan("dev"));
    startupDebugger("DEVELOPMENT ENVIRONEMNT ....\nMORGAN ACTIVE...")
}


const connectToDb = async () => {
    try {
        await mongoose.connect(config.get("mongoDbConnectionURL"));
        dbDebugger("Connected To Db")
        app.listen(PORT, () => startupDebugger(`App is listening to the requets at ${PORT}`));
    } catch (error: any) {
        startupDebugger(error.message)
    }
}

connectToDb();


app.get("/test", (req :express.Request,  res : express.Response)=>{
    res.render("Everything_is_Fine")
})

const PORT = 8000;
