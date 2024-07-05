import express from "express";
import multer from "multer";
import { pageGestion, pageGestionStand, pageGestionUtilisateur, modifierSolde, recupererSolde, connexionGestionnaire, creationPartie, miseUtilisateur, recuperationPartie, ajoutGain, gainPerdu, finPartie, decodageQrCode, listeUtilisateurs } from "../controleurs/gestionControleurs.js";
import { verificateurGestionnaire } from "../middlewares/verificateurGestionnaire.js";
const upload = multer({ storage: multer.memoryStorage() });

const routeurGestion = express.Router();

// Routes pour des pages
routeurGestion.get("/", verificateurGestionnaire, pageGestion);
routeurGestion.get("/stand", verificateurGestionnaire, pageGestionStand);
routeurGestion.get("/utilisateur", verificateurGestionnaire, pageGestionUtilisateur);

routeurGestion.post("/modifier-solde", verificateurGestionnaire, modifierSolde);
routeurGestion.post("/recuperer-solde", verificateurGestionnaire, recupererSolde);
routeurGestion.post("/connexion", connexionGestionnaire);
routeurGestion.get("/cree-partie", verificateurGestionnaire, creationPartie);
routeurGestion.post("/mise", verificateurGestionnaire, miseUtilisateur);
routeurGestion.get("/recuperation-partie", verificateurGestionnaire, recuperationPartie);
routeurGestion.post("/ajout-gain", verificateurGestionnaire, ajoutGain);
routeurGestion.post("/gain-perdu", verificateurGestionnaire, gainPerdu);
routeurGestion.delete("/fin-partie", verificateurGestionnaire, finPartie);
routeurGestion.post("/decodage-qrcode", verificateurGestionnaire, upload.single("image"), decodageQrCode);
routeurGestion.get("/liste-utilisateur", listeUtilisateurs);
export default routeurGestion;
