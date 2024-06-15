import express from "express";
import { standPage } from "../controleurs/pagesControleurs.js";
const routeurPages = express.Router();
routeurPages.get("/stand", standPage);

export default routeurPages;