import QrScanner from "/public/js/modules/scanQRCode/qr-scanner.min.js";

// Function to initialize and start the scanner
async function startScanner() {
    // Select the video element
    const videoElem = document.getElementById("videoElement");

    try {
        // Check for camera permission and initialize video stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoElem.srcObject = stream;
        let qrCodeDetecter = false;

        // Create an instance of QRScanner with the video element
        const qrScanner = new QrScanner(
            videoElem,
            (result) => {
                if (qrCodeDetecter) return;
                qrCodeDetecter = true;

                const donnee = result.data; // Access the scanned data from the detailed scan result object
                console.log("QR Code détecté:", donnee);

                const objetDonnee = {
                    idUtilisateur: donnee,
                };
                fetch("/gestion/recuperer-solde", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(objetDonnee),
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
                            <div id="divBoutonActionPageMise">
                                <a id="validerLaMise" class="bouton" data-mise_max=${reponse.solde} data-id_utilisateur=${reponse.id}>Valider</a>
                                <a id="boutonRetourQRCode" class="bouton">Retour scanneur</a>
                            </div>
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
                                        .then((reponse) => reponse.json())
                                        .then((reponse) => {
                                            if (reponse.mise) {
                                                // location.reload(true);
                                                afficherScanneur();
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
                            document.querySelector("#boutonRetourQRCode").addEventListener("click", () => {
                                // location.reload(true);
                                afficherScanneur();
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
            },
            {
                returnDetailedScanResult: true,
            }
        );

        // Start the scanner
        qrScanner.start();
    } catch (error) {
        alert("Erreur lors de l'accès à la caméra");
        console.error("Erreur lors de l'accès à la caméra:", error);
    }
}

function afficherScanneur() {
    document.querySelector("#divResultat").innerHTML = /*html*/ `
        <video id="videoElement"></video>
        <a id="boutonResultat" class="bouton">Résultats</a>
    `;
    startScanner();
}

// Start the scanner when the page loads
document.addEventListener("DOMContentLoaded", () => {
    startScanner();
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
            document.querySelector("#divResultat").innerHTML =
                divResultat +
                /*html*/ `
            <div id="divBoutonPartie">
                <a id="boutonPartieTerminee" class="bouton">Partie terminée</a>
                <a id="boutonRetourQRCode" class="bouton">Retour scanneur</a>
            </div>
            `;
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
            // Bouton pour retourner au scanneur
            document.querySelector("#boutonRetourQRCode").addEventListener("click", () => {
                // location.reload(true);
                afficherScanneur();
            });
        } else {
            if (reponse.msgErreur == "recharger") {
                // location.reload(true);
                afficherScanneur();
            } else {
                console.error(msgErreur);
            }
        }
    } else {
        console.error("Une erreur est survenue lors de la requête");
    }
});
