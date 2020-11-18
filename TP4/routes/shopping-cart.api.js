const validator = require('validator');
const express = require("express");
const router = express.Router();
const session = require("express-session");
const Product = require("mongoose").model("Product");

router.get(`/`, (req, res) => {
  if(!req.session.cart) {req.session.cart = [];}
  res.json(req.session.cart);
});

router.get(`/:productId`, (req, res) => {
  if(!req.session.cart) {req.session.cart = [];}
  var cart = req.session.cart;
  const product = (cart.find(product => product.productId == req.params.productId))
  if (!product) return res.status(404).send("product not found");
  res.json(product);
});

router.post(`/`, (req, res) => {
  if(!req.body.productId || !validator.isInt(req.body.productId.toString(), {min: 0})) {
    return res.status(400).send("invalid id");
  }
  if(!req.body.quantity || !validator.isInt(req.body.quantity.toString(), {min: 0})) {
    return res.status(400).send("invalid quantity");
  }
  Product.exists({id : req.body.productId}, function (err, result) {
    if(err) return console.error(err);
    if(!result) { return res.status(400).send("product id does not exist"); }
    else {
      if(!req.session.cart) {req.session.cart = [];}
      var cart = req.session.cart;
      if (cart.some(product => product.productId == req.body.productId)) { 
        return res.status(400).send("product already in cart"); 
      }
      else {
        cart.push({ "productId": req.body.productId, "quantity": req.body.quantity });
        req.session.cart = cart;
        res.status(201).send("product added");
      }
    }
  });
});

router.put(`/:productId`, (req, res) => {
  if(!req.body.quantity || !validator.isInt(req.body.quantity.toString(), {min: 0})) {
    return res.status(400).send("invalid quantity");
  }
  if(!req.session.cart) {req.session.cart = [];}
  var cart = req.session.cart;
  const productIndex = cart.findIndex(product => product.productId == req.params.productId);
  if (productIndex == -1) { 
    return res.status(404).send("product not in cart"); 
  }
  else {
    cart[productIndex].quantity = req.body.quantity;
    req.session.cart = cart;
    res.status(204).send("product modified");
  }
});

router.delete(`/:productId`, (req, res) => {
  if(!req.session.cart) {req.session.cart = [];}
  var cart = req.session.cart;
  const productIndex = cart.findIndex(product => product.productId == req.params.productId);
  if (productIndex == -1) { 
    return res.status(404).send("product not in cart"); 
  }
  else {
    cart.splice(productIndex, 1);
    req.session.cart = cart;
    res.status(204).send("product deleted");
  }
});

router.delete(`/`, (req, res) => {
  req.session.cart = [];
  res.status(204).send("products deleted");
});

module.exports = router;