document.querySelector("#form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const donnees = {
        nom: document.querySelector("#nomForm").value,
        mdp: document.querySelector("#mdpForm").value,
    };
    const requete = await fetch("/gestion/connexion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
    });
    if (requete.ok) {
        const reponse = await requete.json();
        if (reponse.connexion) {
            location.reload(true)
        } else {
            console.error("Les données sont fausse");
        }
    } else {
        console.error("Une erreur est survenue lors de la requete");
    }
});
