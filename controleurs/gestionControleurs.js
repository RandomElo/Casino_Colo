import jwt from "jsonwebtoken";
export const recupererSolde = (req, res) => {
    req.Utilisateur.findOne({
        where: { id_utilisateur: req.body.idUtilisateur },
    })
        .then((utilisateur) => {
            if (utilisateur != null) {
                req.UtilisateurPartie.findOne({ where: { id_utilisateur: utilisateur.id_utilisateur } })
                    .then((utilisateurPartie) => {
                        let reponse = {
                            trouve: true,
                            nom: utilisateur.identite_utilisateur,
                            solde: utilisateur.solde_utilisateur,
                            id: utilisateur.id_utilisateur,
                        };
                        if (utilisateurPartie != null) {
                            reponse.mise = utilisateurPartie.mise;
                        } else {
                            reponse.mise = 0;
                        }
                        res.json(reponse);
                    })
                    .catch((erreur) => {
                        console.error("Une erreur est survenue lors de la recherche dans la table UtilisateurPartie");
                        console.error(erreur);
                        res.json({ trouve: false, msgErreur: "inexistant", lieu: "Recherche table UtilisateurPartie" });
                    });
            } else {
                res.json({ trouve: false, msgErreur: "inexistant", lieu: "L'utilisateur est inexistant" });
            }
        })
        .catch((erreur) => {
            console.error("Une erreur est survenue lors de la recherche de l'utilisateur");
            console.error(erreur);
            res.json({ trouve: false, msgErreur: erreur, lieu: "Recherche Utilisateur" });
        });
};
export const modifierSolde = (req, res) => {
    // const solde_utilisateur = req.body.solde_utilisateur;
    req.Utilisateur.update(
        { solde_utilisateur: req.body.solde_utilisateur },
        {
            where: { id_utilisateur: req.body.id_utilisateur },
        }
    )
        .then(() => res.json({ miseAJour: true }))
        .catch((erreur) => {
            console.error(erreur);
            res.json({ miseAJour: false, msgErreur: erreur });
        });
};
export const connexionGestionnaire = (req, res) => {
    req.Gestionnaire.findOne({
        where: { prenom_gestionnaire: req.body.nom },
    })
        .then((gestionnaire) => {
            if (gestionnaire != null) {
                if (gestionnaire.mdp_gestionnaire == req.body.mdp) {
                    res.cookie("gestionnaire", gestionnaire.id_gestionnaire, {
                        maxAge: 100 * 60 * 60 * 60 * 24,
                        httpOnly: true,
                        sameSite: "strict",
                        // secure:true
                    });
                    res.json({ connexion: true });
                } else {
                    res.json({ connexion: false });
                }
            } else {
                res.json({ connexion: false });
            }
        })
        .catch((erreur) => {
            console.error(erreur);
            res.json({ connexion: false, msgErreur: erreur });
        });
};
export const creationPartie = (req, res) => {
    req.Gestionnaire.findOne({
        where: { id_gestionnaire: req.cookies.gestionnaire },
    }).then((gestionnaire) => {
        if (gestionnaire != null) {
            req.Partie.create({
                id_gestionnaire: req.cookies.gestionnaire,
            })
                .then((partie) => {
                    res.cookie("partie", partie.id_partie, {
                        maxAge: 100 * 60 * 60 * 60 * 24,
                        httpOnly: true,
                        sameSite: "strict",
                        // secure:true
                    });
                    res.json({ cree: true, partie });
                })
                .catch((erreur) => {
                    console.error(erreur);
                    res.json({ cree: false, msgErreur: erreur });
                });
        } else {
            console.error("Le gestionnaire n'existe pas");
            res.clearCookie("gestionnaire");
            res.json({ cree: false });
        }
    });
};
export const miseUtilisateur = (req, res) => {
    req.UtilisateurPartie.findOne({ where: { id_utilisateur: req.body.idUtilisateur } })
        .then((utilisateur) => {
            if (utilisateur == null) {
                req.UtilisateurPartie.create({
                    id_partie: req.cookies.partie,
                    id_utilisateur: req.body.idUtilisateur,
                    mise: req.body.mise,
                })
                    .then(() => res.json({ mise: true }))
                    .catch((erreur) => {
                        console.error("Erreur lors de la création de la mise");
                        console.error(erreur);
                        res.json({ mise: false, msgErreur: erreur, lieu: "Création de la mise" });
                    });
            } else {
                const donnee = {
                    mise: req.body.mise,
                };
                req.UtilisateurPartie.update(donnee, {
                    where: { id_utilisateur: req.body.idUtilisateur },
                }).then(() => res.json({ mise: true }));
            }
        })
        .catch((erreur) => {
            console.error("Erreur lors de la recherche de l'utilisateur");
            console.error(erreur);
            res.json({ mise: false, msgErreur: erreur, lieu: "Recherche utilisateur" });
        });
};
export const recuperationPartie = async (req, res ) => {
    if(req.cookies.gestionnaire!= null ) {
        const utilisateurPartie = await req.UtilisateurPartie.findAll({where:{id_partie:req.cookies.partie}})
        res.json({recuperer:true, resultat:utilisateurPartie})
    } else {
        res.json({recuperer:false, msgErreur:"recharger"})
    }
}