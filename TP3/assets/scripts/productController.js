/* global $, document, sessionStorage */
import getProducts from "./productsService.js";
import updateShoppingCartView from "./main.js";

let fullProductList = [];

getProducts().then((data) => {
    fullProductList = data;
    populateProductPage();
});

// Product
const urlParam = function(name) {
    const results = new RegExp("[?&]".concat(name).concat("=([^&#]*)")).exec(window.location.href);
    if (results === null) {
        return null;
    } else {
        return results[1] || 0;
    }
};
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
const productId = urlParam("id");

function populateProductPage() {
    if (productId != undefined) {
        const selectedProduct = fullProductList.find((product) => { return product.id == productId; });
        if (selectedProduct != undefined) {
            $("#product-image").attr("alt", selectedProduct.name);
            $("#product-image").attr("src", "./assets/img/".concat(selectedProduct.image));
            $("#product-name").html(selectedProduct.name);
            $("#product-desc").html(selectedProduct.description);
            $("#product-price").html("Prix: <strong>".concat(selectedProduct.price).concat("&thinsp;$</strong>").replace(/\./, ","));
            const featureList = $("#product-features");
            Array.from(selectedProduct.features).forEach((feature) => {
                const newFeature = document.createElement("li");
                newFeature.innerHTML = feature;
                featureList.append(newFeature);
            });
        } else {
            $("main").html("");
            const errorText = document.createElement("h1");
            errorText.innerHTML = "Page non trouvée!";
            $("main").append(errorText);
        }
    }
}

const addToCartForm = document.getElementById("add-to-cart-form");
if (addToCartForm != undefined) {
    addToCartForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const quantity = $("#product-quantity").val();
        const cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
        const selectedProduct = fullProductList.find((product) => { return product.id == productId; });
        if (selectedProduct != undefined) {
            for (let i = 0; i < quantity; i++) {
                cartList.push(selectedProduct);
            }
        }
        sessionStorage.setItem("shoppingCartItems", JSON.stringify(cartList));
        dialog.innerHTML = "Le produit a été ajouté au panier.";
        updateShoppingCartView();
        $("#dialog").show();
        setTimeout(function() {
            $("#dialog").hide();
        }, 5000);
    });
}
