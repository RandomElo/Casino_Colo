import express from "express";
import { tableauScore } from "../controleurs/pagesControleurs.js";
const routeurPages = express.Router();

routeurPages.get("/", tableauScore);

export default routeurPages;
