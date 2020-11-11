const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/index", {title: "Accueil"});
});

router.get("/accueil", (req, res) => {
    res.render("pages/index", {title: "Accueil"});
});

router.get("/produits", (req, res) => {
    res.render("pages/products", {title: "Produits"});
});

router.get("/produits/:id", (req, res) => {
    res.render("pages/product", {title: "Produit", id: req.params.id});
});

router.get("/contact", (req, res) => {
    res.render("pages/contact", {title: "Contact"});
});

router.get("/panier", (req, res) => {
    res.render("pages/shopping-cart", {title: "Panier"});
});

router.get("/commande", (req, res) => {
    res.render("pages/order", {title: "Commande"});
});

router.get("/confirmation", (req, res) => {
    res.render("pages/confirmation", {title: "Confirmation"});
});

module.exports = router;
