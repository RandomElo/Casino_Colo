import { Sequelize } from "sequelize";

import Utilisateur from "../modeles/Utilisateur.js";
import Gestionnaire from "../modeles/Gestionnaire.js";
import Partie from "../modeles/Partie.js";
import UtilisateurPartie from "../modeles/UtilisateurPartie.js";

const sequelize = new Sequelize("bdd", process.env.BDD_UTILISATEUR, process.env.BDD_MDP, {
    dialect: "sqlite",
    storage: "./bdd.sqlite",
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: false,
    },
});

const bdd = {
    sequelize,
    Utilisateur: Utilisateur(sequelize),
    Gestionnaire: Gestionnaire(sequelize),
    Partie: Partie(sequelize),
    UtilisateurPartie: UtilisateurPartie(sequelize),
};

// Permet de crée les relations

bdd.Utilisateur.belongsToMany(bdd.Partie, { through: bdd.UtilisateurPartie, foreignKey: "id_utilisateur" });
bdd.Partie.belongsToMany(bdd.Utilisateur, { through: bdd.UtilisateurPartie, foreignKey: "id_partie" });

//Crée les modèles si il ne sont pas déjç crée
bdd.sequelize.sync().catch((erreur) => {
    console.error(erreur);
});

export default bdd;
