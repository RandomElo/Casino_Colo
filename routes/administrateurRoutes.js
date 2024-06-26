import express from "express";
import { administration, ajoutUtilisateur, listeUtilisateur, ajoutGestionnaire, listeGestionnaire, suppressionGestionnaire, suppressionUtilisateur, connexionAdministrateur } from "../controleurs/administrateurControleurs.js";
const routeurAdministrateur = express.Router();
routeurAdministrateur.get("/", administration);
routeurAdministrateur.post("/ajout-utilisateur", ajoutUtilisateur);
routeurAdministrateur.get("/liste-utilisateur", listeUtilisateur);
routeurAdministrateur.post("/ajout-gestionnaire", ajoutGestionnaire);
routeurAdministrateur.get("/liste-gestionnaire", listeGestionnaire);
routeurAdministrateur.delete("/suppression-gestionnaire", suppressionGestionnaire);
routeurAdministrateur.delete("/suppression-utilisateur", suppressionUtilisateur);
routeurAdministrateur.post("/connexion-administrateur", connexionAdministrateur);

export default routeurAdministrateur;
