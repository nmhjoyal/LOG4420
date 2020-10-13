/* global sessionStorage, $, document, window, confirm */

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

$.get("http://localhost:8000/data/products.json", function(data) {
    fullProductList = data;
    products = {category: "all", sort: "lowestHighest", productList: fullProductList.sort((a, b) => { return a.price - b.price; })};
    recreateProductList();
    populateProductPage();
    populateShoppingCartPage();
}, "json");

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
            productPrice.innerHTML = "<small>Prix</small> ".concat(product.price).concat("&thinsp;$").replace(/\./, ",");

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

// Shopping-cart

function populateShoppingCartPage() {
    let shoppingCartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
    if (shoppingCartList.length === 0) {
        $("#shopping-cart-page").html("");
        const errorText = document.createElement("p");
        errorText.innerHTML = "Aucun produit dans le panier.";
        $("#shopping-cart-page").append(errorText);
    } else {
        shoppingCartList = shoppingCartList.sort(function(a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) { return -1; }
            else if (nameA > nameB) { return 1; }
            else return 0;
        });

        const shoppingCartWithCount = [];
        shoppingCartList.forEach(product => {
            const selectedProduct = shoppingCartWithCount.find((p) => { return product.id == p.id; });
            if (selectedProduct != undefined) {
                selectedProduct.quantity++;
            }
            else {
                shoppingCartWithCount.push(
                    {
                        "id": product.id,
                        "name": product.name,
                        "price": product.price,
                        "quantity": 1
                    },
                );
            }
        });

        const shoppingCartListDiv = $("#shopping-cart-content");
        let price = 0;
        if (shoppingCartListDiv != undefined) {
            shoppingCartListDiv.html("");
            shoppingCartWithCount.forEach(product => {
                const newProduct = document.createElement("tr");

                const col1 = document.createElement("td");
                const deleteButton = document.createElement("button");
                deleteButton.setAttribute("title", "Supprimer");
                deleteButton.setAttribute("onclick", "removeItem(".concat(product.id).concat(");"));
                deleteButton.setAttribute("class", "remove-item-button");
                const deleteLogo = document.createElement("i");
                deleteLogo.setAttribute("class", "fa fa-times");
                deleteButton.appendChild(deleteLogo);
                col1.appendChild(deleteButton);
                newProduct.appendChild(col1);

                const col2 = document.createElement("td");
                const productName = document.createElement("a");
                productName.setAttribute("href", "./product.html?id=".concat(product.id));
                productName.innerHTML = product.name;
                col2.appendChild(productName);
                newProduct.appendChild(col2);

                const col3 = document.createElement("td");
                col3.innerHTML = "".concat(product.price).concat("&thinsp;$").replace(/\./, ",");
                newProduct.appendChild(col3);

                const col4 = document.createElement("td");
                const productQuantity = document.createElement("div");
                productQuantity.setAttribute("class", "row");
                const minusDiv = document.createElement("div");
                minusDiv.setAttribute("class", "col");
                const minusButton = document.createElement("button");
                minusButton.setAttribute("title", "Retirer");
                minusButton.setAttribute("onclick", "minusItem(".concat(product.id).concat(");"));
                minusButton.setAttribute("class", "remove-quantity-button");
                if(product.quantity == 1) {
                    minusButton.setAttribute("disabled", "");
                }
                const minusLogo = document.createElement("i");
                minusLogo.setAttribute("class", "fa fa-minus");
                minusButton.appendChild(minusLogo);
                minusDiv.appendChild(minusButton);
                productQuantity.appendChild(minusDiv);

                const quantityDiv = document.createElement("div");
                quantityDiv.setAttribute("class", "col quantity");
                quantityDiv.innerHTML = product.quantity;
                productQuantity.appendChild(quantityDiv);

                const plusDiv = document.createElement("div");
                plusDiv.setAttribute("class", "col");
                const plusButton = document.createElement("button");
                plusButton.setAttribute("title", "Retirer");
                plusButton.setAttribute("onclick", "plusItem(".concat(product.id).concat(");"));
                plusButton.setAttribute("class", "add-quantity-button");
                const plusLogo = document.createElement("i");
                plusLogo.setAttribute("class", "fa fa-plus");
                plusButton.appendChild(plusLogo);
                plusDiv.appendChild(plusButton);
                productQuantity.appendChild(plusDiv);
                col4.appendChild(productQuantity);
                newProduct.appendChild(col4);

                const col5 = document.createElement("td");
                col5.setAttribute("class", "price");
                col5.innerHTML = "".concat((product.price * product.quantity).toFixed(2)).concat("&thinsp;$").replace(/\./, ",");
                newProduct.appendChild(col5);

                shoppingCartListDiv.append(newProduct);

                price += product.price * product.quantity;
            });
        }
        $("#total-amount").html("Total: <strong>".concat(price.toFixed(2)).concat("&thinsp;$</strong>").replace(/\./, ","));
    }
}

function emptyCart() {
    if(confirm("Voulezvous supprimer tous les produits du panier ?")) {
        sessionStorage.setItem("shoppingCartItems", JSON.stringify([]));
        updateShoppingCartView();
        populateShoppingCartPage();
    }
}

function removeItem(productId) {
    if(confirm("Voulez-vous supprimer le produit du panier ?")) {
        let cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
        cartList = cartList.filter(product => product.id != productId);
        sessionStorage.setItem("shoppingCartItems", JSON.stringify(cartList));
        updateShoppingCartView();
        populateShoppingCartPage();
    }
}

function plusItem(productId) {
    const cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
    const item = cartList.find(product => product.id == productId);
    cartList.push(item);
    sessionStorage.setItem("shoppingCartItems", JSON.stringify(cartList));
    updateShoppingCartView();
    populateShoppingCartPage();
}

function minusItem(productId) {
    const cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
    const index = cartList.findIndex(product => product.id == productId);
    cartList.splice(index, 1);
    sessionStorage.setItem("shoppingCartItems", JSON.stringify(cartList));
    updateShoppingCartView();
    populateShoppingCartPage();
}