// AJOUT DU NOUVEAU CODE

// Affichage de la caméra sur l'écran
navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } }) // Demande d'accès à la caméra arrière du téléphone
    .then(function (stream) {
        var videoElement = document.querySelector("#videoElement");
        videoElement.srcObject = stream; // Affichage du flux vidéo dans l'élément vidéo
    })
    .catch(function (error) {
        console.error("Erreur lors de l'accès à la caméra: ", error); // Affichage de l'erreur si l'accès à la caméra échoue
    });

// Surveillance du click sur le bouton pour l'envoi
document.querySelector("#boutonCapture").addEventListener("click", function () {
    var videoElement = document.querySelector("#videoElement");
    var canvas = document.createElement("canvas"); // Création d'un élément canvas pour capturer l'image de la vidéo
    canvas.width = videoElement.videoWidth; // Définition de la largeur du canvas égale à celle de la vidéo
    canvas.height = videoElement.videoHeight; // Définition de la hauteur du canvas égale à celle de la vidéo
    var context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height); // Dessin de l'image vidéo actuelle sur le canvas

    // Conversion du canvas en Blob (image)
    canvas.toBlob(function (blob) {
        var formData = new FormData();
        formData.append("image", blob, "capture.png"); // Ajout du Blob au FormData pour l'envoi

        // Envoi de l'image au serveur pour le décodage du QR code
        fetch("/gestion/decodage-qrcode", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json()) // Conversion de la réponse en JSON
            .then((donnees) => {
                console.log(donnees);
                if (!donnees.error) {
                    console.log("QR Code :", donnees.valeur); // Affichage des données du QR code dans la console
                    const donnee = {
                        idUtilisateur: donnees.valeur,
                    };
                    fetch("/gestion/recuperer-solde", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(donnee),
                    })
                        .then((reponse) => reponse.json())
                        .then((reponse) => {
                            if (reponse.trouve) {
                                document.querySelector("#divResultat").innerHTML = /*html*/ `<div>
                                    <p><span class="gras">Nom : </span>${reponse.nom}</p>
                                    <div id="divInputMise"><p class="gras"><span>Mise : </p><input type="number" value="${reponse.mise}" max="${reponse.solde}" id="inputMise"></div>
                                    <div id="divBoutonMise">
                                        <a id="ajoutMise1" class="bouton boutonMise" data-mise=1>+ 1</a>
                                        <a id="ajoutMise10" class="bouton boutonMise" data-mise=10>+ 10</a>
                                        <a id="ajoutMise100" class="bouton boutonMise" data-mise=100>+ 100</a>
                                        <a id="ajoutMise1000" class="bouton boutonMise" data-mise=1000>+ 1 000</a>
                                    </div>
                                    <a id="validerLaMise" class="bouton" data-mise_max=${reponse.solde} data-id_utilisateur=${reponse.id}>Valider</a>
                                </div>`;
                                document.querySelectorAll(".boutonMise").forEach((bouton) => {
                                    bouton.addEventListener("click", (e) => {
                                        if (Number(document.querySelector("#inputMise").value) + Number(e.target.dataset.mise) <= Number(reponse.solde)) {
                                            document.querySelector("#inputMise").value = Number(document.querySelector("#inputMise").value) + Number(e.target.dataset.mise);
                                        } else {
                                            alert("Le solde du compte n'est pas suffisant");
                                        }
                                    });
                                });
                                document.querySelector("#validerLaMise").addEventListener("click", async (e) => {
                                    if (Number(document.querySelector("#inputMise").value) <= Number(e.target.dataset.mise_max)) {
                                        const donnees = {
                                            mise: document.querySelector("#inputMise").value,
                                            idUtilisateur: e.target.dataset.id_utilisateur,
                                        };
                                        fetch("/gestion/mise", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify(donnees),
                                        })
                                            .then((reponse) => {
                                                if (reponse.mise) {
                                                    location.reload(true);
                                                } else {
                                                    if (reponse.msgErreur.name == "SequelizeUniqueConstraintError") {
                                                        alert("Vous avez déjà défini la mise pour cet utilisateur");
                                                    } else {
                                                        console.log(reponse);
                                                    }
                                                }
                                            })
                                            .catch((erreur) => {
                                                console.error("Une erreur est survenue lors de l'envoi de la requête");
                                                console.error(erreur);
                                            });
                                    } else {
                                        alert("Le solde du compte n'est pas suffisant");
                                    }
                                });
                            } else {
                                if (reponse.msgErreur == "inexistant") {
                                    alert("Utilisateur inexistant");
                                } else {
                                    console.error(reponse.msgErreur);
                                }
                            }
                        })
                        .catch((erreur) => {
                            console.error(erreur);
                        });
                } else {
                    console.error("Erreur lors du décodage du QR-Code");
                    alert("Erreur lors du décodage du QR-Code");
                }
            })
            .catch((erreur) => {
                console.error("Erreur lors de l'envoi de l'image:", erreur); // Affichage de l'erreur si l'envoi échoue
            });
    }, "image/png"); // Spécification du format de l'image (PNG)
});

document.querySelector("#boutonResultat").addEventListener("click", async () => {
    const requete = await fetch("/gestion/recuperation-partie", {
        methode: "GET",
    });
    if (requete.ok) {
        const reponse = await requete.json();
        console.clear();
        if (reponse.recuperer) {
            const donnees = reponse.donnees;
            let divResultat = "";
            for (let i = 0; i < donnees.length; i++) {
                let element = donnees[i];
                divResultat += /*html*/ `<div id="divUtilisateur${element.id_utilisateur}" class="divUtilisateurPartie">
                        <p><span class="gras">Nom : </span>${element.nom_utilisateur}</p>
                        <div class="divMutltiplicateurGagner" data-id_utilisateur=${element.id_utilisateur} >
                            <a class="bouton boutonMultiplicateur miseX2">x 2</a>
                            <a class="bouton boutonMultiplicateur miseX5">x 5</a>
                            <a class="bouton boutonMultiplicateur miseX10">x 10</a>
                        </div>
                        <a class="bouton boutonPartiePerdu" data-id_utilisateur=${element.id_utilisateur}>Perdu</a>
                    </div>`;
            }
            document.querySelector("#divResultat").innerHTML = divResultat + /*html*/ `<a id="boutonPartieTerminee" class="bouton">Partie terminée</a>`;
            // Bouton qui permet de multiplier la mise
            document.querySelectorAll(".boutonMultiplicateur").forEach((bouton) => {
                bouton.addEventListener("click", async (e) => {
                    //const gainMutiplicateur = Number(e.target.classList[1].split("X")[1]) * Number(e.target.parentNode.dataset.solde);
                    const donnees = {
                        idUtilisateur: e.target.parentNode.dataset.id_utilisateur,
                        gainMultiplicateur: e.target.classList[2].split("X")[1],
                    };
                    console.log(donnees);
                    const requete = await fetch("/gestion/ajout-gain", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(donnees),
                    });
                    if (requete.ok) {
                        const reponse = await requete.json();
                        if (reponse.ajout) {
                            document.querySelector(`#divUtilisateur${e.target.parentNode.dataset.id_utilisateur}`).style.display = "none";
                        } else {
                            if (reponse.msgErreur == "Utilisateur Inexistant") {
                                alert("L'utilisateur n'existe pas");
                            } else {
                                console.error(reponse.msgErreur);
                            }
                        }
                    } else {
                        console.error("Une erreur est survenue lors de la requête");
                    }
                });
            });
            // Bouton si jamais la mise est perdu
            document.querySelectorAll(".boutonPartiePerdu").forEach((bouton) => {
                bouton.addEventListener("click", async (e) => {
                    const donnee = {
                        idUtilisateur: e.target.dataset.id_utilisateur,
                    };
                    const requete = await fetch("/gestion/gain-perdu", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(donnee),
                    });
                    if (requete.ok) {
                        const reponse = await requete.json();
                        if (reponse.maj) {
                            document.querySelector(`#divUtilisateur${e.target.dataset.id_utilisateur}`).style.display = "none";
                        } else {
                            if (reponse.msgErreur == "Utilisateur Inexistant") {
                                alert("L'utilisateur n'existe pas");
                            } else {
                                console.log(reponse.msgErreur);
                            }
                        }
                        console.log(reponse);
                    } else {
                        console.error("Une erreur est survenue lors de l'envoie de la requête");
                    }
                });
            });
            // Bouton qui supprime tout une fois la partie terminer
            document.querySelector("#boutonPartieTerminee").addEventListener("click", async () => {
                const requete = await fetch("/gestion/fin-partie", {
                    method: "DELETE",
                });
                if (requete.ok) {
                    const reponse = await requete.json();
                    console.log(reponse);
                } else {
                    console.error("Une erreur est survenue lors de l'envoi de la requête");
                }
            });
        } else {
            if (reponse.msgErreur == "recharger") {
                location.reload(true);
            } else {
                console.error(msgErreur);
            }
        }
    } else {
        console.error("Une erreur est survenue lors de la requête");
    }
});
