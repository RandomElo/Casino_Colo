import express from "express";
import { pageStand } from "../controleurs/gestionControlleurs.js";
const routeurGestion = express.Router();
routeurGestion.get("/stand", pageStand);
export default routeurGestion;
