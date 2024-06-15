import { Sequelize } from "sequelize";

import Utilisateur from "../modeles/Utilisateur.js";
import Gestionnaire from "../modeles/Gestionnaire.js";

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
};

//Crée les modèles si il ne sont pas déjç crée
bdd.sequelize.sync()
.catch((erreur)=>{
    console.error(erreur)
})

export default bdd;
