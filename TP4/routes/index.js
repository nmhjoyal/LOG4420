const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/index");
});

router.get("/accueil", (req, res) => {
    res.render("pages/index");
});

router.get("/produits", (req, res) => {
    res.render("pages/products");
});

router.get("/produits/:id", (req, res) => {
    res.render("pages/product", {id: req.params.id});
});

router.get("/contact", (req, res) => {
    res.render("pages/contact");
});

router.get("/panier", (req, res) => {
    res.render("pages/shopping-cart");
});

router.get("/commande", (req, res) => {
    res.render("pages/order");
});

router.get("/confirmation", (req, res) => {
    res.render("pages/confirmation");
});

module.exports = router;
