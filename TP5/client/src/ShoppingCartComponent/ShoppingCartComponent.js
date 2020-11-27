import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {Link} from "react-router-dom"
import { formatPrice } from "../utils.js"
import { useEffect, useState } from 'react';

export function ShoppingCartComponent() {
    document.title="OnlineShop - Panier";
    const [ordersItems, setItems] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const item = await fetch("http://localhost:4000/api/shopping-cart", {credentials: 'include' });
                const list = await fetch("http://localhost:4000/api/products", {credentials: 'include' });
                if(item.ok && list.ok) {
                    const orderItems = await item.json();
                    const productsList = await list.json();
                    let items = [];
                    orderItems.forEach((orderItem) => {
                        items.push(
                            {
                                product: productsList.find(item => parseInt(item.id) === parseInt(orderItem.productId)),
                                quantity: orderItem.quantity
                            });
                    });
                    setItems(items);
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
            setItems(ordersItems);
            console.log("ok");
        } else {
            console.log("nope2");
        }
    }

    return (
        <div>
            <Header/>
            <main>
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
                            <tr>
                                <td><button className="remove-item-button" title="Supprimer"><i className="fa fa-times"></i></button></td>
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
                    <p className="shopping-cart-total">Total: <strong id="total-amount"></strong></p>
                    <a className="btn pull-right" href="./commande">Commander <i className="fa fa-angle-double-right"></i></a>
                    <button className="btn" id="remove-all-items-button"><i className="fa fa-trash-o"></i>&nbsp; Vider le panier</button>
                </div>
            </article>
        </main>
            <Footer/>
        </div>
    );
}
