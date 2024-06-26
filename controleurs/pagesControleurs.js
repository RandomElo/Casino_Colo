export const standPage = (req, res) => {
    if (req.cookies.gestionnaire) {
        if (req.cookies.partie) {
            res.render("stand.ejs", { titre: "Stand", css: "stand", js: "stand" });
        } else {
            res.render("creationPartie.ejs", { titre: "Création Partie", css: "creationPartie", js: "creationPartie" });
        }
    } else {
        res.render("connexion.ejs", { titre: "Connexion Gestionnaire", css: "connexion", js: "connexionGestionnaire" });
    }
};
