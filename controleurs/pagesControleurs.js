export const tableauScore = (req, res) => {
    res.render("tableauScore.ejs", { titre: "Tableau des scores", css: "tableauScore", js: "tableauScore" });
};
