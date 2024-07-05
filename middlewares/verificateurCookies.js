export const verificateurCookie = async (req, res, next) => {
    if (req.originalUrl == "/public/css/bootstrap.min.css.map") {
        return next();
    }
    if (req.cookies.administrateur) {
        if (req.cookies.administrateur != "4^CAGi83c7*WbAaMouBo") {
            console.error("Cookie administrateur incorrect");
            res.clearCookie("administrateur");
        }
    }
    // Gestion Gestionnaire
    if (req.cookies.gestionnaire) {
        try {
            const gestionnaire = await req.Gestionnaire.findByPk(req.cookies.gestionnaire);
            if (gestionnaire) {
                // Gestion Partie
                const partie = await req.Partie.findOne({ where: { id_gestionnaire: req.cookies.gestionnaire } });
                if (partie != null) {
                    res.cookie("partie", partie.id_partie, {
                        maxAge: 100 * 60 * 60 * 60 * 24,
                        httpOnly: true,
                        sameSite: "strict",
                        secure: process.env.ENV_NODE === "production",
                    });
                    // Permet de pouvoir savoir si une partie existe meme si res n'est pas encore arriver à destination
                    req.partie = true;
                } else {
                    console.log("Une partie n'existe pas");
                }
            } else {
                console.error("Le gestionnaire n'existe pas");
                res.clearCookie("gestionnaire");
            }
        } catch (erreur) {
            console.error(erreur);
        }
    }
    next();
};
