document.querySelector("#boutonCreationUtilisateur").addEventListener("click", async () => {
    const donnee = {
        identite: prompt("Quel est le nom ?"),
    };
    if (donnee.identite != null) {
        const requete = await fetch("/administrateur/ajout-utilisateur", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(donnee),
        });
        if (requete.ok) {
            const reponse = await requete.json();
            if (reponse.operation) {
                console.log("L'enregistrement c'est bien effectuer");
            } else {
                console.log("Une erreur est survenue lors de l'enregistrement");
            }
        } else {
            console.log("Une erreur est survenue lors de l'envoi de la requête");
        }
    }
});
document.querySelector("#boutonGestionUtilisateur").addEventListener("click", async () => {
    const requete = await fetch("/administrateur/liste-utilisateur", {
        method: "GET",
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.length == 0) {
            document.querySelector("#divResultat").innerHTML = /*html*/ `<p class="text-danger">Aucun utilisateur est enregistrer</p>`;
        } else {
            let divResultat = "";
            for (let i = 0; i < reponse.length; i++) {
                const element = reponse[i];
                const div = /*html*/ `<div class="divEnfant">
                    <p><span class="gras">Nom: </span>${element.identite_utilisateur}</p>
                    <p><span class="gras">Solde: </span>${element.solde_utilisateur}</p>
                    <a class="modifierSolde bouton" data-id_utilisateur="${element.id_utilisateur}" data-solde="${element.solde_utilisateur}">Modifier le solde</a>
                </div>`;
                divResultat += div;
            }
            document.querySelector("#divResultat").innerHTML = divResultat;
            document.querySelectorAll(".modifierSolde").forEach((bouton) => {
                bouton.addEventListener("click", async (e) => {
                    const donnee = {
                        id_utilisateur: e.target.dataset.id_utilisateur,
                        solde_utilisateur: prompt(`Quel est le nouveau solde ? [${e.target.dataset.solde}]`),
                    };
                    const requete = await fetch("/gestion/modifier-solde", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(donnee),
                    });
                    if (requete.ok) {
                        const reponse = await requete.json();
                        if (reponse.miseAJour) {
                            console.log("La mise à jour à étais effectuer avec succés");
                        } else {
                            console.error(reponse.msgErreur);
                        }
                        console.log(reponse);
                    } else {
                        console.error("Une erreur est survenue lors de l'envoie de la requete");
                    }
                });
            });
        }
    } else {
        console.error("Une erreur est survenue lors de la requête");
    }
});
document.querySelector("#boutonCreationGestionnaire").addEventListener("click", async () => {
    const donnees = {
        prenom: prompt("Quel est le prénom ?"),
        mdp: prompt("Quel est le mdp ?"),
    };
    if (donnees.prenom != null && donnees.mdp != null) {
        const requete = await fetch("/administrateur/ajout-gestionnaire", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(donnees),
        });
        if (requete.ok) {
            const reponse = await requete.json();
            if (reponse.ajout) {
                console.log("Le gestionnaire à étais ajouter");
            } else {
                console.error(reponse.msgErreur);
            }
        } else {
            console.error("Une erreur esr survenue lors de l'envoi de la requête");
        }
    }
});
document.querySelector("#boutonGestionGestionnaire").addEventListener("click", async () => {
    const requete = await fetch("/administrateur/liste-gestionnaire", {
        method: "GET",
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.length == 0) {
            document.querySelector("#divResultat").innerHTML = /*html*/ `<p class="text-danger">Aucun gestionnaire est enregistrer</p>`;
        } else {
            let divResultat = "";
            for (let i = 0; i < reponse.length; i++) {
                const element = reponse[i];
                const div = /*html*/ `<div class="divEnfant">
                    <p><span class="gras">Prénom: </span>${element.prenom_gestionnaire}</p>
                    <p><span class="gras">Mdp: </span>${element.mdp_gestionnaire}</p>
                </div>`;
                divResultat += div;
            }
            document.querySelector("#divResultat").innerHTML = divResultat;
        }
    } else {
        console.error("Une erreur est survenue lors de la requête ");
    }
});
