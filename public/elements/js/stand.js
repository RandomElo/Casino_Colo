// Sélection des éléments HTML
var video = document.getElementById("videoElement");

// Fonction pour démarrer la lecture vidéo depuis la caméra

async function demarrerVideo() {
    try {
        const flux = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = flux;
        video.play();
    } catch (erreur) {
        console.error("Erreur lors de l'accès à la caméra :", erreur);
    }
}
// Démarrer la vidéo lors du chargement de la page
demarrerVideo();

// Détecter les QR codes en utilisant la bibliothèque Instascan
var scanner = new Instascan.Scanner({ video: video });
var qrCodeDetected = false;

async function gestionScan(contenu) {
    // Empeche d'autre exécution
    if (qrCodeDetected) return;
    qrCodeDetected = true;

    console.log("QR Code détecté : " + contenu);
    const donnee = {
        idUtilisateur: contenu,
    };
    const requete = await fetch("/gestion/recuperer-solde", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(donnee),
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.trouve) {
            document.querySelector("#divResultat").innerHTML = /*html*/ `<div>
                <p><span class="gras">Nom : </span>${reponse.nom}</p>
                <div id="divInputMise"><p class="gras"><span>Mise : </p><input type="number" value=${reponse.mise} max="${reponse.solde}" id="inputMise"></div>
                <div id="divBoutonMise">
                    <a id="ajoutMise1" class="boutonMise" data-mise=1>+ 1</a>
                    <a id="ajoutMise10" class="boutonMise" data-mise=10>+ 10</a>
                    <a id="ajoutMise100" class="boutonMise" data-mise=100>+ 100</a>
                    <a id="ajoutMise1000" class="boutonMise" data-mise=1000>+ 1 000</a>
                </div>
                <a id="validerLaMise" data-mise_max=${reponse.solde} data-id_utilisateur=${reponse.id}>Valider</a>
            </div>`;
            document.querySelectorAll(".boutonMise").forEach((bouton) => {
                bouton.addEventListener("click", (e) => {
                    if (Number(document.querySelector("#inputMise").value) + Number(e.target.dataset.mise) <= Number(reponse.solde)) {
                        document.querySelector("#inputMise").value = Number(document.querySelector("#inputMise").value) + Number(e.target.dataset.mise);
                    } else {
                        alert("Le solde du compte est pas suffisant");
                    }
                });
            });
            document.querySelector("#validerLaMise").addEventListener("click", async (e) => {
                if (Number(document.querySelector("#inputMise").value <= Number(e.target.dataset.mise_max))) {
                    const donnees = {
                        mise: document.querySelector("#inputMise").value,
                        idUtilisateur: e.target.dataset.id_utilisateur,
                    };
                    const requete = await fetch("/gestion/mise", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(donnees),
                    });
                    if (requete.ok) {
                        const reponse = await requete.json();
                        if (reponse.mise) {
                            console.log("Vous avez pu miser");
                        } else {
                            if (reponse.msgErreur.name == "SequelizeUniqueConstraintError") {
                                alert("Vous avez déjà défini la mise pour cette utilisateur");
                            } else {
                                console.log(reponse);
                            }
                        }
                    } else {
                        console.error("Une erreur est survenue lors de l'envoi de la requête");
                    }
                } else {
                    alert("Le solde du compte est pas suffisant");
                }
            });
        } else {
            if (reponse.msgErreur == "inexistant") {
                console.error("Utilisateur inexistant");
            } else {
                console.error(reponse.msgErreur);
            }
        }
    } else {
        console.error("Une erreur est survenue");
    }
}

scanner.addListener("scan", gestionScan); // Ajouter un écouteur pour le scan des QR codes
//gestionScan(3);

// Démarrer la détection des QR codes

Instascan.Camera.getCameras()
    .then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error("Aucune caméra trouvée.");
        }
    })
    .catch(function (erreur) {
        console.error("Erreur lors de l'accès aux caméras :", erreur);
    });
document.querySelector("#boutonResultat").addEventListener("click", async () => {
    const requete = await fetch("/gestion/recuperation-partie", {
        methode: "GET",
    });
    if (requete.ok) {
        const reponse = await requete.json();
        console.clear();
        console.log(reponse);
        if (reponse.recuperer) {
            const donnees = reponse.donnees;
            let divResultat = "";
            for (let i = 0; i < donnees.length; i++) {
                let element = donnees[i];
                divResultat += /*html*/ `<div class="divUtilisateurPartie">
                    <p><span class="gras">Nom : </span>${element.nom_utilisateur}</p>
                    <div class="divMutltiplicateurGagner">
                        <a class="boutonMultiplicateur miseX2">x 2</a>
                        <a class="boutonMultiplicateur miseX5">x 5</a>
                        <a class="boutonMultiplicateur miseX10">x 10</a>
                    </div>
                    <a class="boutonPartie"></a>
                    <a class="boutonPartiePerdu">Perdu</a>
                </div>`;
            }
            document.querySelector("#divResultat").innerHTML = divResultat;
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
