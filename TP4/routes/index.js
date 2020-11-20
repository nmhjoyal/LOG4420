const express = require("express");
const router = express.Router();
const Product = require("mongoose").model("Product");
const productAPI = require("./products.api");

router.get("/", (req, res) => {
    res.render("pages/index", {activeTab: "home"});
});

router.get("/accueil", (req, res) => {
    res.render("pages/index", {activeTab: "home"});
});

router.get("/produits", (req, res) => {
    Product.find().collation({ locale: "en" }).sort("price").exec(function (err, products) {
        if (err) return console.error(err);
        res.render("pages/products", {activeTab: "products", products: products, formatPrice: formatPrice});
      });
});

router.get("/produits/:id", (req, res) => {
    Product.findOne({id : req.params.id}, function (err, product) {
        if(err) return console.error(err);
        if(product == null) {
            res.render("pages/product", {isHidden: true, activeTab: "products"});
        }
        res.render("pages/product", {product: product, id: req.params.id, isHidden: false, activeTab: "products"});
      });
});

router.get("/contact", (req, res) => {
    res.render("pages/contact", {activeTab: "contact"});
});

router.get("/panier", (req, res) => {
    if(!req.session.cart) {req.session.cart = [];}
    res.render("pages/shopping-cart", {cart: req.session.cart, activeTab: "shopping-cart"});
});

router.get("/commande", (req, res) => {
    res.render("pages/order", {activeTab: "order"});
});

router.get("/confirmation", (req, res) => {
    res.render("pages/confirmation", {activeTab: "confirmation"});
});

module.exports = router;

function formatPrice(price) {
    return price.toFixed(2).replace(".", ",") + "&thinsp;$";
}
