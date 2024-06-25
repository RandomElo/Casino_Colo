document.querySelector("#form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const donnees = {
        nom: e.target[0].value,
        mdp: e.target[1].value,
    };
    const requete = await fetch("/administrateur/connexion-administrateur", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.cree) {
            location.reload(true);
        } else {
            alert("Problème lors de l'authentification");
        }
    } else {
        console.error("Une erreur est survenue lors de l'envoi de la requête");
    }
});
