export const accesibiliteBDD = (bdd) => {
    return (req, res, next) => {
        const { sequelize, Utilisateur, Gestionnaire } = bdd;

        req.sequelize = sequelize;
        req.Utilisateur = Utilisateur;
        req.Gestionnaire = Gestionnaire;

        next();
    };
};
