import express from "express";
import multer from "multer";
import { modifierSolde, recupererSolde, connexionGestionnaire, creationPartie, miseUtilisateur, recuperationPartie, ajoutGain, gainPerdu, finPartie, decodageQrCode, listeUtilisateurs } from "../controleurs/gestionControleurs.js";

const upload = multer({ storage: multer.memoryStorage() });

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
routeurGestion.post("/decodage-qrcode", upload.single("image"), decodageQrCode);
routeurGestion.get("/liste-utilisateur", listeUtilisateurs);
export default routeurGestion;
