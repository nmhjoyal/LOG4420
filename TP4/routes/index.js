const express = require("express");
const router = express.Router();
const Product = require("mongoose").model("Product");

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
    Product.findOne({id : req.params.id}, function (err, product) {
        if(err) return console.error(err);
        if(product == null) {
            res.render("pages/product", {product: product, id: req.params.id, isHidden: true});
        }
        res.render("pages/product", {product: product, id: req.params.id, isHidden: false});
      });
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
