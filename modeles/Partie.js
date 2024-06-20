import { DataTypes } from "sequelize";
export default function (bdd) {
    const Partie = bdd.define("Parties", {
        id_partie: {
            type: DataTypes.INTEGER(),
            autoIncrement: true,
            primaryKey: true,
        },
        id_gestionnaire: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
    });
    return Partie;
}
