"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const debug_1 = __importDefault(require("debug"));
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
const startupDebugger = (0, debug_1.default)("app:startup");
const dbDebugger = (0, debug_1.default)("app:dbDebugger");
app.set("view engine", "ejs");
app.set('views', path_1.default.resolve(__dirname, '../client/views'));
app.use((0, cookie_parser_1.default)("token"));
app.use(express_1.default.static((path_1.default.join(__dirname, '../../public'))));
// app.use(express.static(path.join(__dirname, '../../public')));
// console.log((path.join(__dirname, '../../public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/auth", authRoutes_1.default);
if (app.get("env") === "development") {
    app.use((0, morgan_1.default)("dev"));
    startupDebugger("DEVELOPMENT ENVIRONEMNT ....\nMORGAN ACTIVE...");
}
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.get("mongoDbConnectionURL"));
        dbDebugger("Connected To Db");
        app.listen(PORT, () => startupDebugger(`App is listening to the requets at ${PORT}`));
    }
    catch (error) {
        startupDebugger(error.message);
    }
});
connectToDb();
app.get("/test", (req, res) => {
    res.render("Everything_is_Fine");
});
const PORT = 8000;
