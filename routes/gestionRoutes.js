import express from "express";
import { modifierSolde, recupererSolde, connexionGestionnaire, creationPartie, miseUtilisateur, recuperationPartie, ajoutGain, gainPerdu, finPartie, cameraInforamtion, qrCode } from "../controleurs/gestionControleurs.js";
const routeurGestion = express.Router();
routeurGestion.post("/modifier-solde", modifierSolde);
routeurGestion.post("/recuperer-solde", recupererSolde);
routeurGestion.post("/connexion", connexionGestionnaire);
routeurGestion.get("/cree-partie", creationPartie);
routeurGestion.post("/mise", miseUtilisateur);
routeurGestion.get("/recuperation-partie", recuperationPartie);
routeurGestion.post("/ajout-gain", ajoutGain);
routeurGestion.post("/gain-perdu", gainPerdu);
routeurGestion.delete("/fin-partie", finPartie);
routeurGestion.post("/camera-detail", cameraInforamtion);

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
routeurGestion.post("/test-upload", upload.single("image"), qrCode);
export default routeurGestion;
