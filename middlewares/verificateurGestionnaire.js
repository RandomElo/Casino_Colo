export const verificateurGestionnaire = async (req, res, next) => {
    try {
        const gestionnaire = await req.Gestionnaire.findByPk(req.cookies.gestionnaire);
        if (gestionnaire) {
            next();
        } else {
            console.error("Le gestionnaire n'existe pas");
            res.clearCookie("gestionnaire");
            return res.render("connexion.ejs", { titre: "Connexion Gestionnaire", css: "connexion", js: "connexionGestionnaire" });
        }
    } catch (erreur) {
        console.error(erreur);
    }
};
