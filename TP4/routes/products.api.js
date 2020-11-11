const mongoose = require("../lib/db");
const express = require("express");
const router = express.Router();

router.get(`/api/products`, (req, res) => {
    const criteria = req.query.criteria.toString().split("-");
    const sortOn = criteria[0].trim() == "price" ? "price": "name";
    const order = criteria[1].trim() == "dsc" ? "-": "";
    const findCondition = req.query.category ? {category : req.query.category} : {};

    mongoose.model('Product').find(findCondition).sort(order + sortOn).exec(function (err, products) {
        if (err) return console.error(err);
        res.json(products);
      });
});

module.exports = router;