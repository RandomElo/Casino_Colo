// Sélection des éléments HTML
var video = document.getElementById("videoElement");
var cameraSelect = document.getElementById("cameraSelect");

// Fonction pour démarrer la lecture vidéo depuis la caméra
async function demarrerVideo(deviceId) {
    try {
        const flux = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: deviceId ? { exact: deviceId } : undefined }
        });
        video.srcObject = flux;
        video.play();
    } catch (erreur) {
        console.error("Erreur lors de l'accès à la caméra :", erreur);
    }
}

// Fonction pour arrêter le scan
function arreterScan() {
    scanner.stop();
    console.log("Scan arrêté");
}

// Détecter les QR codes en utilisant la bibliothèque Instascan
var scanner = new Instascan.Scanner({ video: video });
var qrCodeDetected = false;

async function gestionScan(contenu) {
    // Empêche d'autres exécutions
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
                            location.reload(true);
                        } else {
                            if (reponse.msgErreur.name == "SequelizeUniqueConstraintError") {
                                alert("Vous avez déjà défini la mise pour cet utilisateur");
                            } else {
                                console.log(reponse);
                            }
                        }
                    } else {
                        console.error("Une erreur est survenue lors de l'envoi de la requête");
                    }
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
    } else {
        console.error("Une erreur est survenue");
    }
}

scanner.addListener("scan", gestionScan); // Ajouter un écouteur pour le scan des QR codes

// Obtenir la liste des caméras et les ajouter au select
Instascan.Camera.getCameras()
    .then(function (cameras) {
        cameras.forEach((camera, i) => {
            var option = document.createElement("option");
            option.value = camera.id;
            option.text = camera.name || `Camera ${i + 1}`;
            cameraSelect.appendChild(option);
        });

        // Ajouter un écouteur sur le changement de sélection de caméra
        cameraSelect.addEventListener("change", () => {
            var selectedCameraId = cameraSelect.value;
            demarrerVideo(selectedCameraId);
            scanner.start(cameras.find(camera => camera.id === selectedCameraId));
        });

        // Utiliser la deuxième caméra si deux caméras sont disponibles
        if (cameras.length > 1) {
            cameraSelect.value = cameras[1].id;
            demarrerVideo(cameras[1].id);
            scanner.start(cameras[1]);
        } else if (cameras.length > 0) {
            // Sinon, utiliser la première caméra disponible
            cameraSelect.value = cameras[0].id;
            demarrerVideo(cameras[0].id);
            scanner.start(cameras[0]);
        }
    })
    .catch(function (erreur) {
        console.error("Erreur lors de l'accès aux caméras :", erreur);
    });
