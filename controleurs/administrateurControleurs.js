export const accueilAdmin = (req, res) => {
    res.render("accueilAdmin.ejs", { titre: "Administrateur", css: "accueilAdmin", js: "accueilAdmin" });
};
export const ajoutUtilisateur = (req, res) => {
    req.Utilisateur.create({
        identite_utilisateur: req.body.identite,
        solde_utilisateur: 0,
    })
        .then(() => res.json({ operation: true }))
        .catch((erreur) => {
            console.error(erreur);
            res.json({ operation: false, messageErreur: erreur });
        });
};
export const listeUtilisateur = async (req, res) => {
    const listeUtilisateur = await req.Utilisateur.findAll();
    res.json(listeUtilisateur);
};
export const ajoutGestionnaire = (req, res) => {
    req.Gestionnaire.create({
        prenom_gestionnaire: req.body.prenom,
        mdp_gestionnaire: req.body.mdp,
    })
        .then(() => res.json({ ajout: true }))
        .catch((erreur) => {
            console.error(erreur);
            res.json({ ajout: false, msgErreur: erreur });
        });
};
export const listeGestionnaire = async (req, res) => {
    const listeGestionnaire = await req.Gestionnaire.findAll();
    res.json(listeGestionnaire);
};
export const suppressionGestionnaire = async (req, res) => {
    req.Gestionnaire.destroy({ where: { id_gestionnaire: req.body.idGestionnaire } })
        .then(() => res.json({ suppression: true }))
        .catch((erreur) => {
            console.error(erreur);
            res.json({ suppression: false, msgErreur: erreur });
        });
};
export const suppressionUtilisateur = async (req, res) => {
    req.Utilisateur.destroy({ where: { id_utilisateur: req.body.idUtilisateur } })
        .then(() => res.json({ suppression: true }))
        .catch((erreur) => {
            console.error(erreur);
            res.json({ suppression: false, msgErreur: erreur });
        });
}