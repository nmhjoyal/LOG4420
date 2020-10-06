sessionStorage.setItem("shoppingCartItems", JSON.stringify(["", "allo"]));

const listeCount = document.getElementsByClassName("count");

Array.from(listeCount).forEach(element => {
    if (JSON.parse(sessionStorage.getItem("shoppingCartItems")).length === 0) {
        element.style.visibility = "hidden";
    } else {
        element.style.visibility = "visible";
        element.innerHTML = JSON.parse(sessionStorage.getItem("shoppingCartItems")).length;
    }
});