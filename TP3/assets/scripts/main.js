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


var request = new XMLHttpRequest();
request.open("GET", "http://localhost:8000/data/products.json");
var products = {category: "all", sort: "lowestHighest", productList: []};
var fullProductList = [];

request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        const response = JSON.parse(this.responseText);
        fullProductList = response;
        products = {category: "all", sort: "lowestHighest", productList: response.sort((a, b) => { return a.price - b.price; })};
        recreateProductList();
    }
};
request.send();

function filterView(category) {
    products.category = category;
    sortAndFilterProducts();
    Array.from(document.getElementById("product-categories").children).forEach((child) => {
        child.removeAttribute("class");
    });
    document.getElementById(category).setAttribute("class", "selected");
}

function sortView(sortType) {
    products.sort = sortType;
    sortAndFilterProducts();
    Array.from(document.getElementById("product-criteria").children).forEach((child) => {
        child.removeAttribute("class");
    });
    document.getElementById(sortType).setAttribute("class", "selected");

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
    document.getElementById("products-count").innerHTML = products.productList.length.toString().concat(" produits");
    recreateProductList();
}

function recreateProductList() {
    const productListDiv = document.getElementById("products-list");
    productListDiv.innerHTML = "";
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
        productListDiv.appendChild(newProduct);
    });
}