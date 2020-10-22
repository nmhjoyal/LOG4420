/* global sessionStorage, $ */


// Header
updateShoppingCartView();

export default function updateShoppingCartView() {
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

