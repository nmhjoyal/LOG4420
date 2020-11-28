import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {Link} from "react-router-dom"
import { formatPrice, calculateTotalCartItems } from "../utils.js"
import { useEffect, useState } from 'react';

export function ShoppingCartComponent() {
    document.title="OnlineShop - Panier";
    const [ordersItems, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [isEmpty, setIsEmpty] = useState(false);
    const [cartItemsLength, setCartItems] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const item = await fetch("http://localhost:4000/api/shopping-cart", {credentials: 'include' });
                const list = await fetch("http://localhost:4000/api/products", {credentials: 'include' });
                if(item.ok && list.ok) {
                    const orderItems = await item.json();
                    const productsList = await list.json();
                    let calcTotal = 0.0;
                    let items = [];
                    orderItems.forEach((orderItem) => {
                        const cartItem = {
                            product: productsList.find(item => parseInt(item.id) === parseInt(orderItem.productId)),
                            quantity: orderItem.quantity
                        };
                        items.push(cartItem);
                        calcTotal += cartItem.quantity * cartItem.product.price;
                    });
                    if (items.length === 0) {
                        setIsEmpty(true);
                    }
                    setItems(items);
                    setTotal(calcTotal);
                    setCartItems(calculateTotalCartItems(orderItems));
                } else {
                    throw item.json();
                }
            } catch(e) {
                console.error(e);
            }
        }
        fetchData();
    }, []);

    async function updateQuantity(item) {
        const prod = await fetch(`http://localhost:4000/api/shopping-cart/${item.product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({productId: item.product.id, quantity: item.quantity})
        });
        if(prod.ok) {
            const newList = [...ordersItems];
            newList.find((selectedItem) => parseInt(selectedItem.product.id) === parseInt(item.product.id)).quantity = item.quantity;
            setItems(newList);
            setCartItems(calculateTotalCartItems(newList));
            updateTotal();
        } else {
            console.log("nope2");
        }
    };

    async function removeItem(item) {
        if (window.confirm("Voulez-vous supprimer le produit du panier?")){
            const prod = await fetch(`http://localhost:4000/api/shopping-cart/${item.product.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
            if(prod.ok) {
                const newItems = ordersItems.filter((orderitem) => orderitem !== item);
                setItems(newItems);
                if (newItems.length === 0) {
                    setIsEmpty(true);
                }
                updateTotal();
                setCartItems(calculateTotalCartItems(newItems));
            } else {
                console.log("nope2");
            }
        }
    };

    function updateTotal() {
        let calcTotal = 0.0;
        ordersItems.forEach((orderItem) => {
            calcTotal += orderItem.quantity * orderItem.product.price;
        });
        setTotal(calcTotal);
    };

    async function emptyCart() {
        if (window.confirm("Voulez-vous supprimer tous les produits du panier?")) {
            const prod = await fetch(`http://localhost:4000/api/shopping-cart`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
            if (prod.ok) {
                setCartItems(0);
                setIsEmpty(true);
            }
        }
    }

    let content;
    if (isEmpty) {
        content = (
            <article>
                <h1>Panier</h1>
                <div id="shopping-cart-container">
                    <p>Aucun produit dans le panier.</p>
                </div>
            </article>
        )
    } else {
        content = (
            <article>
                <h1>Panier</h1>
                <div id="shopping-cart-container">
                    <table className="table shopping-cart-table">
                        <thead>
                            <tr>
                            <th></th>
                            <th>Produit</th>
                            <th>Prix unitaire</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                            </tr>
                        </thead>
                        <tbody>
                        {ordersItems.map(item => 
                            <tr key={item.product.id}>
                                <td><button className="remove-item-button" title="Supprimer" onClick={() => removeItem(item)}><i className="fa fa-times"></i></button></td>
                                <td><Link to={`./product/${item.product.id}`}>{item.product.name}</Link></td>
                                <td>{formatPrice(item.product.price)}</td>
                                <td>
                                    <div className="row">
                                    <div className="col"><button className="remove-quantity-button" title="Retirer" onClick={() => {item.quantity = item.quantity - 1; updateQuantity(item)}} disabled={item.quantity <= 1 ? "disabled" : ""}>
                                    <i className="fa fa-minus"></i></button></div>
                                    <div className="col quantity">{item.quantity}</div>
                                    <div className="col"><button className="add-quantity-button" title="Ajouter" onClick={() => {item.quantity = item.quantity + 1; updateQuantity(item)}}><i className="fa fa-plus"></i></button></div>
                                    </div>
                                </td>
                                <td className="price">{formatPrice(item.product.price * item.quantity)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <p className="shopping-cart-total">Total: <strong id="total-amount">{formatPrice(total)}</strong></p>
                    <a className="btn pull-right" href="./commande">Commander <i className="fa fa-angle-double-right"></i></a>
                    <button className="btn" id="remove-all-items-button" onClick={() => emptyCart()}><i className="fa fa-trash-o"></i>&nbsp; Vider le panier</button>
                </div>
            </article>
        );
    }
    return (
        <div>
            <Header cartCount={cartItemsLength}/>
            <main>
                {content}
            </main>
            <Footer/>
        </div>
    );
}
