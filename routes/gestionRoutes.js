import express from "express";
import { modifierSolde, recupererSolde } from "../controleurs/gestionControleurs.js";
const routeurGestion = express.Router();
routeurGestion.post("/modifier-solde", modifierSolde);
routeurGestion.post("/recuperer-solde", recupererSolde);
export default routeurGestion;
