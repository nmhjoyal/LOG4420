// Header
updateShoppingCartView();

function updateShoppingCartView() {
    if (sessionStorage.getItem("shoppingCartItems") === null) {
        sessionStorage.setItem("shoppingCartItems", JSON.stringify([]));
    }
    const shoppingCartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
    if (shoppingCartList.length === 0) {
        $(".count").attr("style", "visibility: hidden;");
    } else {
        $(".count").attr("style", "visibility: visible;");
        $(".count").html(shoppingCartList.length);
    }
}

// Products
let products = {category: "all", sort: "lowestHighest", productList: []};
let fullProductList = [];

$.get("/data/products.json", function(data) {
    fullProductList = data;
    products = {category: "all", sort: "lowestHighest", productList: fullProductList.sort((a, b) => { return a.price - b.price; })};
    recreateProductList();
    populateProductPage();
});

function filterView(category) {
    products.category = category;
    sortAndFilterProducts();
    Array.from($("#product-categories").children()).forEach((child) => {
        child.removeAttribute("class");
    });
    $("#".concat(category)).addClass("selected");
}

function sortView(sortType) {
    products.sort = sortType;
    sortAndFilterProducts();
    Array.from($("#product-criteria").children()).forEach((child) => {
        child.removeAttribute("class");
    });
    $("#".concat(sortType)).addClass("selected");

}

function sortAndFilterProducts() {
    if (products.category != "all") {
        products.productList = fullProductList.filter((product) => product.category == products.category);
    } else {
        products.productList = fullProductList;
    }

    if (products.sort == "lowestHighest") {
        products.productList = products.productList.sort((a, b) => { return a.price - b.price; });
    } else if (products.sort == "highestLowest") {
        products.productList = products.productList.sort((a, b) => { return b.price - a.price; });
    } else if (products.sort == "aToZ") {
        products.productList = products.productList.sort(function(a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) { return -1; }
            else if (nameA > nameB) { return 1; }
            else return 0;
        });
    } else {
        products.productList = products.productList.sort(function(a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA > nameB) { return -1; }
            else if (nameA < nameB) { return 1; }
            else return 0;
        });
    }
    $("#products-count").html(products.productList.length.toString().concat(" produits"));
    recreateProductList();
}

function recreateProductList() {
    const productListDiv = $("#products-list");
    if (productListDiv != undefined) {
        productListDiv.html("");
        products.productList.forEach(product => {
            const newProduct = document.createElement("div");
            newProduct.setAttribute("class", "product");
            const productLink = document.createElement("a");
            productLink.setAttribute("href", "./product.html?id=".concat(product.id));
            productLink.setAttribute("title", "En savoir plus...");
            const productHeader = document.createElement("h2");
            productHeader.innerHTML = product.name;
            const productImg = document.createElement("img");
            productImg.setAttribute("alt", product.name);
            productImg.setAttribute("src", "./assets/img/".concat(product.image));
            const productPrice = document.createElement("p");
            productPrice.setAttribute("class", "price");
            productPrice.innerHTML = "<small>Prix</small> ".concat(product.price).concat("&thinsp;$");

            productLink.appendChild(productHeader);
            productLink.appendChild(productImg);
            productLink.appendChild(productPrice);
            newProduct.appendChild(productLink);
            productListDiv.append(newProduct);
        });
    }
}

// Product
$.urlParam = function(name) {
    const results = new RegExp("[?&]".concat(name).concat("=([^&#]*)")).exec(window.location.href);
    if (results === null) {
        return null;
    } else {
        return results[1] || 0;
    }
};
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
const productId = $.urlParam("id");

function populateProductPage() {
    if (productId != undefined) {
        const selectedProduct = fullProductList.find((product) => { return product.id == productId; });
        if (selectedProduct != undefined) {
            $("#product-image").attr("alt", selectedProduct.name);
            $("#product-image").attr("src", "./assets/img/".concat(selectedProduct.image));
            $("#product-name").html(selectedProduct.name);
            $("#product-desc").html(selectedProduct.description);
            $("#product-price").html("Prix: <strong>".concat(selectedProduct.price).concat("&thinsp;$</strong>"));
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
        let cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
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