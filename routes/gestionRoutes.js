import express from "express";
import { modifierSolde, recupererSolde, connexionGestionnaire, creationPartie, miseUtilisateur } from "../controleurs/gestionControleurs.js";
const routeurGestion = express.Router();
routeurGestion.post("/modifier-solde", modifierSolde);
routeurGestion.post("/recuperer-solde", recupererSolde);
routeurGestion.post("/connexion", connexionGestionnaire);
routeurGestion.get("/cree-partie", creationPartie);
routeurGestion.post("/mise", miseUtilisateur);
export default routeurGestion;
