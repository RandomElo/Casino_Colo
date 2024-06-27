function generationTableau() {
    console.log("Actualisation")
    fetch("/gestion/liste-utilisateur", {
        method: "GET",
    })
        .then((resultat) => resultat.json())
        .then((resultat) => {
            let tableau = /*html*/ `
                <div id ="divTable" class="container">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Rang</th>
                                <th scope="col">Prénom</th>
                                <th scope="col">Score</th>
                            </tr>
                        </thead>
                        <tbody>`;
            // Permet de trier les éléments présent dans résultat
            // Donc si a est inférieur b va au dessus
            resultat.sort((a, b) => b.solde_utilisateur - a.solde_utilisateur);
            for (let i = 0; i < resultat.length; i++) {
                const element = resultat[i];
                tableau += /*html*/ `
                <tr>
                    <th scope="row">${i == 0 ? "🥇" : i == 1 ? "🥈" : i == 2 ? "🥉" : "&nbsp" + i}</th>
                    <td>${element.identite_utilisateur}</td>
                    <td>${element.solde_utilisateur}</td>
                </tr>
                `;
            }
            tableau += /*html*/ `</tbody></table></div>`;
            document.querySelector("#divResultat").innerHTML = tableau;
        });
}
generationTableau();
setInterval(generationTableau, 15000)
