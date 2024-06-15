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
