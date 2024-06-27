import express from "express";
import { tableauScore, standPage } from "../controleurs/pagesControleurs.js";
const routeurPages = express.Router();

routeurPages.get("/", tableauScore);
routeurPages.get("/stand", standPage);

export default routeurPages;
