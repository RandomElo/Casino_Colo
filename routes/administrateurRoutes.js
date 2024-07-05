import express from "express";

import { verificateurAdministrateur } from "../middlewares/verificateurAdministrateur.js";
import { administration, ajoutUtilisateur, listeUtilisateur, ajoutGestionnaire, listeGestionnaire, suppressionGestionnaire, suppressionUtilisateur, connexionAdministrateur, suppressionBDD } from "../controleurs/administrateurControleurs.js";

const routeurAdministrateur = express.Router();

routeurAdministrateur.get("/", verificateurAdministrateur, administration);
routeurAdministrateur.post("/ajout-utilisateur", verificateurAdministrateur, ajoutUtilisateur);
routeurAdministrateur.get("/liste-utilisateur", verificateurAdministrateur, listeUtilisateur);
routeurAdministrateur.post("/ajout-gestionnaire", verificateurAdministrateur, ajoutGestionnaire);
routeurAdministrateur.get("/liste-gestionnaire", verificateurAdministrateur, listeGestionnaire);
routeurAdministrateur.delete("/suppression-gestionnaire", verificateurAdministrateur, suppressionGestionnaire);
routeurAdministrateur.delete("/suppression-utilisateur", verificateurAdministrateur, suppressionUtilisateur);
routeurAdministrateur.post("/connexion-administrateur", connexionAdministrateur);
routeurAdministrateur.delete("/suppression-bdd", verificateurAdministrateur, suppressionBDD);

export default routeurAdministrateur;
