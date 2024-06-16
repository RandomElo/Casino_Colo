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
        console.log(reponse);
        if (reponse.trouve) {
            document.querySelector("#divResultat").innerHTML = /*html*/ `<div>
                <p><span class="gras">Nom : </span>${reponse.nom}</p>
                <div><p class="gras"><span>Mise : </p><input type="number" value=0 max="${reponse.solde}" id="inputMise"></div>
                <div id="divBoutonMise">
                    <a id="ajoutMise1" class="boutonMise">+ 1</a>
                    <a id="ajoutMise10" class="boutonMise">+ 10</a>
                    <a id="ajoutMise100" class="boutonMise">+ 100</a>
                </div>
                <a id="validerLaMise">Valider</a>
            </div>`;
            let mise = document.querySelector("#inputMise").value;
            console.log(mise);
            document.querySelector("#ajoutMise1").addEventListener("click", () => {
                if (mise + 1 <= reponse.solde) {
                    console.log("Vous pouvez miser cette somme");
                    document.querySelector("#inputMise").value = Number(document.querySelector("#inputMise").value)+1
                } else {
                    alert("Le solde du compte est pas assez élever");
                }
            });
            document.querySelector("#ajoutMise10").addEventListener("click", () => {
                if (mise + 10 <= reponse.solde) {
                    console.log("Vous pouvez miser cette somme");
                    document.querySelector("#inputMise").value = Number(document.querySelector("#inputMise").value)+10
                } else {
                    alert("Le solde du compte est pas assez élever");
                }
            });
            document.querySelector("#ajoutMise100").addEventListener("click", () => {
                if (mise + 100 <= reponse.solde) {
                    console.log("Vous pouvez miser cette somme");
                    document.querySelector("#inputMise").value = Number(document.querySelector("#inputMise").value)+100
                } else {
                    alert("Le solde du compte est pas assez élever");
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

// Ajouter un écouteur pour le scan des QR codes
scanner.addListener("scan", gestionScan);

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
