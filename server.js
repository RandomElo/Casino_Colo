import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import { verificateurCookie } from "./middlewares/verificateurCookies.js";
import { accesibiliteBDD } from "./middlewares/accesibiliteBDD.js";
import bdd from "./bdd/bdd.js";

import routeurGestion from "./routes/gestionRoutes.js";
import routeurAdministrateur from "./routes/administrateurRoutes.js";
import routeurPages from "./routes/pagesRoutes.js";

dotenv.config();

const port = 8100;
const app = express();

// Définition du CORS
app.use(
    cors({
        origin: "*", //Toutes les origines sont au
        options: "GET,POST,PATCH,PUT,DELETE", //Les méthodes autorisées
        allowedHeaders: "Content-type,Autorization", //Les en-têtes autorisé
        credentials: true, //Les informations d'authorisation doivent être envoyées lors de la demande de cross origini
    })
);

app.use(express.json()); //Permet d'analyser le corps des requetes entrantes au format JSON
app.use("/", express.static(path.join(process.cwd(), "public")));
app.use("/public", express.static(path.join(process.cwd(), "public/elements")));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(accesibiliteBDD(bdd));

app.use(verificateurCookie);

app.use("/", routeurPages);
app.use("/gestion", routeurGestion);
app.use("/administrateur", routeurAdministrateur);

// Gestion 404

app.listen(port, () => console.log("Serveur démarré => port " + port));
