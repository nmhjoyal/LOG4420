const validator = require('validator');
const express = require("express");
const router = express.Router();
const Order = require("mongoose").model("Order");
const Product = require("mongoose").model("Product");

router.get(`/`, (req, res) => {
  Order.find(function (err, orders) {
    if (err) return console.error(err);
    res.json(orders);
  });
});

router.get(`/:id`, (req, res) => {
  Order.findOne({id : req.params.id}, function (err, order) {
    if(err) return console.error(err);
    if(order == null) { return res.status(404).send("order not found"); }
    res.json(order);
  });
});

router.post(`/`, async (req, res) => {
  if(!req.body.id || !validator.isInt(req.body.id.toString(), {min: 0})) {
    return res.status(400).send("invalid id");
  }
  if(!req.body.firstName || validator.isEmpty(req.body.firstName.toString(), {ignore_whitespace: true})) {
    return res.status(400).send("invalid firstName");
  }
  if(!req.body.lastName || validator.isEmpty(req.body.lastName.toString(), {ignore_whitespace: true})) {
    return res.status(400).send("invalid lastName");
  }
  if(!req.body.email || !validator.isEmail(req.body.email.toString())) {
    return res.status(400).send("invalid email");
  }
  if(!req.body.phone || !validator.isMobilePhone(req.body.phone.toString())) {
    return res.status(400).send("invalid phone number");
  }
  if(!req.body.products || req.body.products.length == 0) {
    return res.status(400).send("invalid products list");
  }
  else{
    const ids = await Product.distinct('id')
    if (req.body.products.some(product => !product.id || !product.quantity 
                                          || !validator.isInt(product.quantity.toString(), {min: 0}) 
                                          || !validator.isIn(product.id.toString(), ids))) {                                                                    
      return res.status(400).send("invalid products list");
  
    }
  }
  const newOrder = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    products: req.body.products
  }
  Order.create(newOrder, function (err) {
    if (err) return res.status(400).send("invalid id");
    res.status(201).send("order created");
  });
});

router.delete(`/:id`, (req, res) => {
  Order.deleteOne({id : req.params.id}, function (err, order) {
    if (err) return console.error(err);
    if (order.n == 0) return res.status(404).send("order not found");
    res.status(204).send("order deleted");
  });
});

router.delete(`/`, (req, res) => {
  Order.deleteMany({}, function (err) {
    if (err) return console.error(err);
    res.status(204).send("orders deleted");
  });
});

module.exports = router;