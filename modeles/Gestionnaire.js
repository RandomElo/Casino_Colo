import { DataTypes } from "sequelize";
export default function (bdd) {
    const Gestionnaire = bdd.define("Gestionnaires", {
        id_gestionnaire: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true,
        },
        prenom_gestionnaire: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mdp_gestionnaire: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });
    return Gestionnaire;
}
