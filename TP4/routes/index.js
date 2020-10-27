const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/index", {title: "Accueil", message: "Ça semble fonctionner!"});
});

router.get("/accueil", (req, res) => {
    res.render("pages/index", {title: "Accueil", filename: "index.ejs"});
});

router.get("/produits", (req, res) => {
    res.render("pages/products", {title: "Produits", filename: "products.ejs"});
});

router.get("/produits/:id", (req, res) => {
    res.render("pages/product", {title: "Produits", filename: "products.ejs"});
});

router.get("/contact", (req, res) => {
    res.render("pages/contact", {title: "Produits", message: "Ça semble fonctionner!"});
});

router.get("/panier", (req, res) => {
    res.render("pages/shopping-cart", {title: "Produits", message: "Ça semble fonctionner!"});
});

router.get("/commande", (req, res) => {
    res.render("pages/order", {title: "Produits", message: "Ça semble fonctionner!"});
});

router.get("/confirmation", (req, res) => {
    res.render("pages/confirmation", {title: "Produits", message: "Ça semble fonctionner!"});
});

module.exports = router;
