
import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {useParams} from "react-router-dom";
import {imageMap} from "../ProductsComponent/ProductImageLoader";
import { calculateTotalCartItems, formatPrice } from "../utils.js"
import { useEffect, useState } from 'react';

export function ProductComponent() {
    document.title="OnlineShop - Produit";
    const { id } = useParams();

    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [hidden, setShowDialog] = useState("dialog");
    const [cartItemsLength, setCartItems] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const item = await fetch("http://localhost:4000/api/shopping-cart", {credentials: 'include' });
                if(item.ok) {
                    const orderItems = await item.json();
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
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prod = await fetch(`http://localhost:4000/api/products/${id}`, {credentials: 'include'});
                if(prod.ok) {
                    setProduct(await prod.json());
                } else {
                    throw prod.json();
                }
            } catch(e) {
                console.error(e);
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    async function submit(event) {
        event.preventDefault();
        let addProduct = { productId: parseInt(id), quantity: parseInt(quantity)};
        const prod = await fetch("http://localhost:4000/api/shopping-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(addProduct)
        });
        if(prod.ok) {
            setCartItems(cartItemsLength + quantity);
        } else {
            const productGet = await fetch(`http://localhost:4000/api/shopping-cart/${id}`, {credentials: 'include'})
            if (productGet.ok) {
                const existingProduct = await productGet.json();
                const update = await fetch(`http://localhost:4000/api/shopping-cart/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({quantity: parseInt(quantity) + parseInt(existingProduct.quantity)})
                });
                if (update.ok) {
                    setCartItems(cartItemsLength + parseInt(quantity));
                } 
            }
        }
    };

    let content;
    if(loading) {
        content = (
            <article>
                <div className="loading"></div>
            </article>
        )
    } else if(product) {
        content = (
            <article>
                <h1 id="product-name">{product.name}</h1>
                <div className="row">
                    <div className="col">
                        <img alt="product" src={imageMap[product.image]} id="product-image"/>
                    </div>
                    <div className="col">
                        <section>
                            <h2>Description</h2>
                            <p id="product-desc">{product.description}</p>
                        </section>
                        <section>
                            <h2>Caractéristiques</h2>
                            <ul id="product-features">
                                {product.features.map(feature => (
                                    <li key={feature}>{feature}</li>    
                                ))}
                            </ul>
                        </section>
                        <hr/>
                        <form className="pull-right" id="add-to-cart-form">
                            <label htmlFor="product-quantity">Quantité:</label>
                            <input className="form-control" type="number" defaultValue="1" min="1" id="product-quantity"
                                onChange={(event) => setQuantity(event.target.value)}/>
                            <button className="btn" title="Ajouter au panier" type="submit" onClick={(event) => submit(event)}>
                                <i className="fa fa-cart-plus"></i>&nbsp; Ajouter
                            </button>
                        </form>
                        <p>Prix: <strong id="product-price">{formatPrice(product.price)}</strong></p>
                    </div>
                </div>
                <div className={hidden.toString()} id="dialog">
                    Le produit a été ajouté au panier.
                </div>
            </article>
        );
    } else {
        console.error("Invalid ID specified");
        content =  (
            <article>
                <h1>Produit non trouvée!</h1>
            </article>
        );
    }
    return (
        <div>
            <Header currentActive="product" cartCount={cartItemsLength}/>
            <main>
                {content}
            </main>
            <Footer/>
        </div>
    );
}
