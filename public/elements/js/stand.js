// Sélection des éléments HTML
var video = document.getElementById('videoElement');
var boutonDemarrer = document.getElementById('boutonDemarrer');

// Fonction pour démarrer la lecture vidéo depuis la caméra
async function demarrerVideo() {
    try {
        const flux = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = flux;
        video.play();
    } catch (erreur) {
        console.error('Erreur lors de l\'accès à la caméra :', erreur);
    }
}

// Démarrer la lecture vidéo lorsque le bouton est cliqué
boutonDemarrer.addEventListener('click', () => {
    demarrerVideo();
});

// Détecter les QR codes en utilisant la bibliothèque instascan (exemple)
const scanner = new Instascan.Scanner({ video: video });

// Lorsqu'un QR code est détecté, faire quelque chose avec le résultat
scanner.addListener('scan', function (contenu) {
    console.log('QR Code détecté : ' + contenu)
    // Ici, vous pouvez traiter le contenu du QR code (par exemple, le sauvegarder, l'afficher, etc.)
});

// Démarrer la détection des QR codes
Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        console.error('Aucune caméra trouvée.');
    }
}).catch(function (erreur) {
    console.error('Erreur lors de l\'accès aux caméras :', erreur);
});
