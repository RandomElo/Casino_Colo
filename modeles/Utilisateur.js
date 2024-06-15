import { DataTypes } from "sequelize";
export default function (bdd) {
    const Utilisateur = bdd.define("Utilisateurs", {
        id_utilisateur: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true,
        },
        identite_utilisateur: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        solde_utilisateur: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });
    return Utilisateur;
}
