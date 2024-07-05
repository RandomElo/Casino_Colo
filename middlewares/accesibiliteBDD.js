export const accesibiliteBDD = (bdd) => {
    return (req, res, next) => {
        const { sequelize, Utilisateur, Gestionnaire, Partie, UtilisateurPartie } = bdd;

        req.sequelize = sequelize;
        req.Utilisateur = Utilisateur;
        req.Gestionnaire = Gestionnaire;
        req.Partie = Partie;
        req.UtilisateurPartie = UtilisateurPartie;

        next();
    };
};