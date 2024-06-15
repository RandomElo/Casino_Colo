import express from "express";
import { accueilAdmin, ajoutUtilisateur, listeUtilisateur, ajoutGestionnaire, listeGestionnaire } from "../controleurs/administrateurControleurs.js";
const routeurAdministrateur = express.Router();
routeurAdministrateur.get("/", accueilAdmin);
routeurAdministrateur.post("/ajout-utilisateur", ajoutUtilisateur);
routeurAdministrateur.get("/liste-utilisateur", listeUtilisateur);
routeurAdministrateur.post("/ajout-gestionnaire", ajoutGestionnaire);
routeurAdministrateur.get("/liste-gestionnaire",listeGestionnaire)

export default routeurAdministrateur;
