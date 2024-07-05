function codeJS() {
    fetch("/gestion/liste-utilisateur", {
        method: "GET",
    })
        .then((reponse) => reponse.json())
        .then((reponse) => {
            let divResultat = "";
            for (let i = 0; i < reponse.length; i++) {
                const element = reponse[i];
                divResultat += /*html*/ `
                <div class="divUtilisateur">
                    <p><span class="gras">Nom : </span>${element.identite_utilisateur}</p>
                    <p><span class="gras">Solde : </span>${element.solde_utilisateur}</p>
                    <a class="modifierLeSolde bouton" data-id_utilisateur=${element.id_utilisateur} data-solde=${element.solde_utilisateur}>Modifier le solde</a>
                </div>`;
            }
            document.querySelector("#divResultat").innerHTML = divResultat;
            document.querySelectorAll(".modifierLeSolde").forEach((bouton) =>
                bouton.addEventListener("click", (e) => {
                    const donnees = {
                        id_utilisateur: e.target.dataset.id_utilisateur,
                        solde_utilisateur: prompt("Quel est le nouveau solde ? Solde actuel : " + e.target.dataset.solde),
                    };
                    fetch("/gestion/modifier-solde", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(donnees),
                    })
                        .then((reponse) => reponse.json())
                        .then((reponse) => {
                            if (reponse.miseAJour) {
                                console.log("La mise à jour à étais effectuer avec succés");
                                codeJS();
                            } else {
                                console.error(reponse.msgErreur);
                            }
                        })
                        .catch((erreur) => {
                            alert("Problème lors de la modification du solde");
                            console.log(erreur);
                        });
                })
            );
        })
        .catch((erreur) => console.error(erreur));
}
codeJS();
