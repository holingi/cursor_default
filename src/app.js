import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import router from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, "..", "public")));
app.use("/api", router);

export default app;
