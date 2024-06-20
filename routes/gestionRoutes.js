import express from "express";
import { modifierSolde, recupererSolde, connexionGestionnaire, creationPartie, miseUtilisateur, recuperationPartie } from "../controleurs/gestionControleurs.js";
const routeurGestion = express.Router();
routeurGestion.post("/modifier-solde", modifierSolde);
routeurGestion.post("/recuperer-solde", recupererSolde);
routeurGestion.post("/connexion", connexionGestionnaire);
routeurGestion.get("/cree-partie", creationPartie);
routeurGestion.post("/mise", miseUtilisateur);
routeurGestion.get("/recuperation-partie", recuperationPartie)
export default routeurGestion;
