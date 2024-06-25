export const administration = (req, res) => {
    // Si pas de cookie alors renvoyer la page de connexion
    if (req.cookies.administrateur != process.env.CHAINE_ADMINISTRATEUR) {
        res.render("connexion.ejs", { titre: "Connexion administrateur", css: "connexion", js: "connexionAdministrateur" });
    } else {
        res.render("administrateur.ejs", { titre: "Administrateur", css: "administrateur", js: "administrateur" });
    }
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
export const suppressionGestionnaire = (req, res) => {
    req.Gestionnaire.destroy({ where: { id_gestionnaire: req.body.idGestionnaire } })
        .then(() => res.json({ suppression: true }))
        .catch((erreur) => {
            console.error(erreur);
            res.json({ suppression: false, msgErreur: erreur });
        });
};
export const suppressionUtilisateur = (req, res) => {
    req.Utilisateur.destroy({ where: { id_utilisateur: req.body.idUtilisateur } })
        .then(() => res.json({ suppression: true }))
        .catch((erreur) => {
            console.error(erreur);
            res.json({ suppression: false, msgErreur: erreur });
        });
};
export const connexionAdministrateur = (req, res) => {
    if (req.body.nom == process.env.NOM_ADMINISTRATEUR) {
        if (req.body.mdp == process.env.MDP_ADMINISTRATEUR) {
            res.cookie("administrateur", process.env.CHAINE_ADMINISTRATEUR, {
                maxAge: 100 * 60 * 60 * 60 * 24,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            });
            res.json({cree:true})
        } else {
            res.json({ cree: false });
        }
    } else {
        res.json({ cree: false });
    }
};
