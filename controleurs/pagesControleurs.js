export const standPage = (req, res) => {
    res.render("stand.ejs", { titre: "Stand", css: "stand", js: "stand" });
};
