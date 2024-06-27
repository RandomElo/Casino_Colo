import express from "express";
import { standPage, testPage } from "../controleurs/pagesControleurs.js";
const routeurPages = express.Router();
routeurPages.get("/stand", standPage);
routeurPages.get("/test", testPage);

export default routeurPages;
