document.querySelector(".bouton").addEventListener("click", async () => {
    const requete = await fetch("/gestion/cree-partie", {
        method: "GET",
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.cree) {
            location.reload(true);
        } else {
            if (reponse.msgErreur != undefined) {
                console.error(reponse.msgErreur);
            } else {
                location.reload(true);
            }
        }
    } else {
        console.error("Une erreur est survenue lors de l'envoi de la requête");
    }
});
