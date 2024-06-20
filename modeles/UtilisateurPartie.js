import { DataTypes } from "sequelize";
export default function (bdd) {
    const UtilisateurPartie = bdd.define("UtilisateursParties", {
        id_relation: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true,
        },
        id_partie: {
            type: DataTypes.INTEGER(),
            references: {
                model: "Partie",
                key: "id_partie",
            },
            allowNull: false,
        },
        id_utilisateur: {
            type: DataTypes.INTEGER(),
            references: {
                model: "Utilisateur",
                key: "id_utilisateur",
            },
            allowNull: false,
        },
        mise: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
    });
    return UtilisateurPartie;
}
