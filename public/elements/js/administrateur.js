async function creationUtilisateur() {
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
            if (!reponse.operation) {
                alert("Une erreur est survenue lors de l'enregistrement");
            }
        } else {
            console.log("Une erreur est survenue lors de l'envoi de la requête");
        }
    }
}
async function gestionUtilisateur() {
    const requete = await fetch("/administrateur/liste-utilisateur", {
        method: "GET",
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.length == 0) {
            document.querySelector("#divResultat").innerHTML = /*html*/ `<p class="text-danger text-center fw-bold">Aucun utilisateur est enregistrer</p>`;
        } else {
            let divResultat = "";
            for (let i = 0; i < reponse.length; i++) {
                const element = reponse[i];
                const div = /*html*/ `<div class="divEnfant">
                    <p><span class="gras">Nom: </span>${element.identite_utilisateur}</p>
                    <p><span class="gras">Solde: </span>${element.solde_utilisateur}</p>
                    <a class="modifierSolde bouton" data-id_utilisateur="${element.id_utilisateur}" data-solde="${element.solde_utilisateur}">Modifier le solde</a>
                    <a class="bouton supprimerUtilisateur" data-id="${element.id_utilisateur}">Supprimer</a>
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
                            gestionUtilisateur();
                        } else {
                            console.error(reponse.msgErreur);
                        }
                    } else {
                        console.error("Une erreur est survenue lors de l'envoie de la requete");
                    }
                });
            });
            document.querySelectorAll(".supprimerUtilisateur").forEach((bouton) => {
                bouton.addEventListener("click", async (e) => {
                    if (confirm("Tu est sur ?")) {
                        const donnee = {
                            idUtilisateur: e.target.dataset.id,
                        };
                        const requete = await fetch("/administrateur/suppression-utilisateur", {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(donnee),
                        });
                        if (requete.ok) {
                            const reponse = await requete.json();
                            if (reponse.suppression) {
                                gestionUtilisateur();
                            } else {
                                console.error(reponse.msgErreur);
                            }
                        } else {
                            console.error("Une erreur est survenue lors de la requête");
                        }
                    }
                });
            });
        }
    } else {
        console.error("Une erreur est survenue lors de la requête");
    }
}
async function creationGestionnaire() {
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
            if (!reponse.ajout) {
                alert("Problème lors de la création du gestionnaire");
                console.error(reponse.msgErreur);
            }
        } else {
            console.error("Une erreur esr survenue lors de l'envoi de la requête");
        }
    }
}
async function gestionGestionnaire() {
    const requete = await fetch("/administrateur/liste-gestionnaire", {
        method: "GET",
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.length == 0) {
            document.querySelector("#divResultat").innerHTML = /*html*/ `<p class="text-danger text-center fw-bold">Aucun gestionnaire est enregistrer</p>`;
        } else {
            let divResultat = "";
            for (let i = 0; i < reponse.length; i++) {
                const element = reponse[i];
                const div = /*html*/ `<div class="divEnfant">
                    <p><span class="gras">Prénom: </span>${element.prenom_gestionnaire}</p>
                    <p><span class="gras">Mdp: </span>${element.mdp_gestionnaire}</p>
                    <a class="bouton supprimerGestionnaire" data-id="${element.id_gestionnaire}">Supprimer</a>
                </div>`;
                divResultat += div;
            }
            document.querySelector("#divResultat").innerHTML = divResultat;

            document.querySelectorAll(".supprimerGestionnaire").forEach((bouton) => {
                bouton.addEventListener("click", async (e) => {
                    if (confirm("Tu est sur ?")) {
                        const donnee = {
                            idGestionnaire: e.target.dataset.id,
                        };
                        const requete = await fetch("/administrateur/suppression-gestionnaire", {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(donnee),
                        });
                        if (requete.ok) {
                            const reponse = await requete.json();
                            console.log(reponse);
                            if (!reponse.suppression) {
                                alert("Problème lors de la suppression de l'utilisateur");
                                console.error(reponse.msgErreur);
                            }
                        } else {
                            console.error("une erreur est survenue lors de l'envoi de la requête");
                        }
                    }
                });
            });
        }
    } else {
        console.error("Une erreur est survenue lors de la requête ");
    }
}
function supprimerBDD() {
    if (confirm("Es-tu sûr ?")) {
        fetch("/administrateur/suppression-bdd", {
            method: "DELETE",
        })
            .then((reponse) => reponse.json())
            .then((reponse) => {
                if (reponse.suppression) {
                    alert("La BDD à bien été supprimer");
                } else {
                    alert("Une erreur est survenue lors de la suppression de la BDD");
                    console.error(reponse.erreurMsg);
                }
            })
            .catch((erreur) => {
                console.error(erreur);
            });
    }
}
document.querySelector("#boutonCreationUtilisateur").addEventListener("click", creationUtilisateur);
document.querySelector("#boutonGestionUtilisateur").addEventListener("click", gestionUtilisateur);
document.querySelector("#boutonCreationGestionnaire").addEventListener("click", creationGestionnaire);
document.querySelector("#boutonGestionGestionnaire").addEventListener("click", gestionGestionnaire);
document.querySelector("#boutonSupprimerBDD").addEventListener("click", supprimerBDD);
