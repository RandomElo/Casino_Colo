export const verificateurAdministrateur = async (req, res, next) => {
    if (req.cookies.administrateur != null) {
        if (req.cookies.administrateur != process.env.CHAINE_ADMINISTRATEUR) {
            console.error("Problème de correspondance dans le cookie administrateur");
            res.clearCookie("administrateur");
            return res.render("connexion.ejs", { titre: "Connexion administrateur", css: "connexion", js: "connexionAdministrateur" });
        } else {
            next();
        }
    } else {
        return res.render("connexion.ejs", { titre: "Connexion administrateur", css: "connexion", js: "connexionAdministrateur" });
    }
};
