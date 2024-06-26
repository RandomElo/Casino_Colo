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
    console.log("JE recoit la  requete");
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
                        secure: process.env.ENV_NODE === "production",
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
                        secure: process.env.ENV_NODE === "production",
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
export const recuperationPartie = async (req, res) => {
    if (req.cookies.gestionnaire != null) {
        const utilisateurPartie = await req.UtilisateurPartie.findAll({ where: { id_partie: req.cookies.partie } });
        let donnees = {};
        for (let i = 0; i < utilisateurPartie.length; i++) {
            const element = await req.Utilisateur.findOne({ where: { id_utilisateur: utilisateurPartie[i].id_utilisateur } });
            donnees[i] = {
                id_utilisateur: utilisateurPartie[i].id_utilisateur,
                nom_utilisateur: element.identite_utilisateur,
                mise_utilisateur: utilisateurPartie[i].mise,
            };
        }
        donnees.length = utilisateurPartie.length;
        res.json({ recuperer: true, donnees });
    } else {
        res.json({ recuperer: false, msgErreur: "recharger" });
    }
};

export const ajoutGain = async (req, res) => {
    req.UtilisateurPartie.findOne({ where: { id_utilisateur: req.body.idUtilisateur } })
        .then((utilisateur) => {
            if (utilisateur != null) {
                req.Utilisateur.update({ solde_utilisateur: utilisateur.solde_utilisateur * req.body.gainMultiplicateur }, { where: { id_utilisateur: req.body.idUtilisateur } })
                    .then(() => res.json({ ajout: true }))
                    .catch((erreur) => {
                        console.error(erreur);
                        res.json({ ajout: false, msgErreur: erreur });
                    });
            } else {
                res.json({ ajout: false, msgErreur: "Utilisateur Inexistant" });
            }
        })
        .catch((erreur) => {
            console.error(erreur);
            res.json({ ajout: false, msgErreur: erreur });
        });
};
export const gainPerdu = (req, res) => {
    req.UtilisateurPartie.findOne({ where: { id_utilisateur: req.body.idUtilisateur } })
        .then((utilisateurPartie) => {
            if (utilisateurPartie != null) {
                req.Utilisateur.findOne({ where: { id_utilisateur: req.body.idUtilisateur } })
                    .then((utilisateur) => {
                        const soldeUtilisateur = utilisateur.solde_utilisateur;
                        req.Utilisateur.update({ solde_utilisateur: utilisateur.solde_utilisateur - utilisateurPartie.mise }, { where: { id_utilisateur: req.body.idUtilisateur } })
                            .then(() => res.json({ maj: true }))
                            .catch((erreur) => {
                                console.error(erreur);
                                res.json({ maj: false, msgErreur: erreur, lieu: "Mise à jour" });
                            });
                    })
                    .catch((erreur) => {
                        console.error(erreur);
                        res.json({ maj: false, msgErreur: erreur, lieu: "Récupération BDD Utilisateur" });
                    });
            } else {
                res.json({ maj: false, msgErreur: "Utilisateur inexistant", lieu: "Récupération BDD UtilisateurPartie" });
            }
        })
        .catch((erreur) => {
            console.error(erreur);
            res.json({ maj: false, msgErreur: erreur });
        });
};
export const finPartie = (req, res) => {
    req.Partie.destroy({ where: { id_partie: req.cookies.partie } })
        .then(async () => {
            const utilisateurPartie = await req.UtilisateurPartie.findAll({ where: { id_partie: req.cookies.partie } });
            for (let i = 0; i < utilisateurPartie.length; i++) {
                const element = utilisateurPartie[i];
                await req.UtilisateurPartie.destroy({ where: { id_utilisateur: element.id_utilisateur } });
            }
            res.clearCookie("partie");
            res.json({ supprimer: true });
        })
        .catch((erreur) => {
            console.error(erreur);
            res.json({ supprimer: false, msgErreur: erreur });
        });
};
export const cameraInforamtion = (req, res) => {
    console.log(req.body.donnees);
    console.log("---------------------------")
    res.json({ traiter: "ok" });
};
