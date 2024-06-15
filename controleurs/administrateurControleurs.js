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
