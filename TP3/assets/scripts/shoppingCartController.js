/* global $, document, sessionStorage, confirm */
import updateShoppingCartView from "./headerController.js";

addOnClicEvent();

function addOnClicEvent() {
    document.getElementById("remove-all-items-button").addEventListener("click", emptyCart);
}

populateShoppingCartPage();

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
                deleteButton.setAttribute("name", product.id);
                deleteButton.addEventListener("click", removeItem);
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
                minusButton.setAttribute("name", product.id);
                minusButton.addEventListener("click", minusItem);
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
                plusButton.setAttribute("name", product.id);
                plusButton.addEventListener("click", plusItem);
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

function removeItem() {
    const productId = this.name;
    if(confirm("Voulez-vous supprimer le produit du panier ?")) {
        let cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
        cartList = cartList.filter(product => product.id != productId);
        sessionStorage.setItem("shoppingCartItems", JSON.stringify(cartList));
        updateShoppingCartView();
        populateShoppingCartPage();
    }
}

function plusItem() {
    const productId = this.name;
    const cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
    const item = cartList.find(product => product.id == productId);
    cartList.push(item);
    sessionStorage.setItem("shoppingCartItems", JSON.stringify(cartList));
    updateShoppingCartView();
    populateShoppingCartPage();
}

function minusItem() {
    const productId = this.name;
    const cartList = JSON.parse(sessionStorage.getItem("shoppingCartItems"));
    const index = cartList.findIndex(product => product.id == productId);
    cartList.splice(index, 1);
    sessionStorage.setItem("shoppingCartItems", JSON.stringify(cartList));
    updateShoppingCartView();
    populateShoppingCartPage();
}

