const validator = require('validator');
const express = require("express");
const router = express.Router();
const Product = require("mongoose").model("Product");

router.get(`/`, (req, res) => {
  let sortCondition = "price";
  if(req.query.criteria) {
    if(!validator.isIn(req.query.criteria.toString(), ["price-asc", "price-dsc", "alpha-asc", "alpha-dsc"])) {
      return res.status(400).send("criteria invalid");
    }
    const criteria = req.query.criteria.toString().split("-");
    let sortOn = criteria[0].trim() == "price" ? "price": "name";
    const order = criteria[1].trim() == "dsc" ? "-": "";
    sortCondition = order + sortOn;
  }
  const findCondition = req.query.category ? {category : req.query.category.toString()} : {};
  if(findCondition.category && !validator.isIn(findCondition.category, ["cameras", "computers", "consoles", "screens"])) {
    return res.status(400).send("category invalid");
  }
  Product.find(findCondition).collation({ locale: "en" }).sort(sortCondition).exec(function (err, products) {
    if (err) return console.error(err);
    res.json(products);
  });
});

router.get(`/:id`, (req, res) => {
  Product.findOne({id : req.params.id}, function (err, product) {
    if(err) return console.error(err);
    if(product == null) { return res.status(404).send("product not found"); }
    res.json(product);
  });
});

router.post(`/`, (req, res) => {
  if(!req.body.id || !validator.isInt(req.body.id.toString(), {min: 0})) {
    return res.status(400).send("invalid id");
  }
  if(!req.body.name || validator.isEmpty(req.body.name.toString(), {ignore_whitespace: true})) {
    return res.status(400).send("invalid name");
  }
  if(!req.body.price || !validator.isFloat(req.body.price.toString(), {min: 0})) {
    return res.status(400).send("invalid price");
  }
  if(!req.body.image || validator.isEmpty(req.body.image.toString(), {ignore_whitespace: true})) {
    return res.status(400).send("invalid image");
  }
  if(!req.body.category || !validator.isIn(req.body.category.toString(), ["cameras", "computers", "consoles", "screens"])) {
    return res.status(400).send("invalid category");
  }
  if(!req.body.description || validator.isEmpty(req.body.description.toString(), {ignore_whitespace: true})) {
    return res.status(400).send("invalid description");
  }
  if(!req.body.features) {
    return res.status(400).send("invalid features");
  }
  else if (req.body.features.some(str => validator.isEmpty(str, {ignore_whitespace: true}))) {
      return res.status(400).send("invalid features");
  }
  
  const newProduct = {
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
    features: req.body.features
  }
  Product.create(newProduct, function (err) {
    if (err) return res.status(400).send("invalid id");
    res.status(201).send("product created");
  });
});

router.delete(`/:id`, (req, res) => {
  Product.deleteOne({id : req.params.id}, function (err, product) {
    if (err) return console.error(err);
    if (product.n == 0) return res.status(404).send("product not found");
    res.status(204).send("product deleted");
  });
});

router.delete(`/`, (req, res) => {
  Product.deleteMany({}, function (err) {
    if (err) return console.error(err);
    res.status(204).send("products deleted");
  });
});

module.exports = router;