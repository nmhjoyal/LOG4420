
import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import { calculateTotalCartItems } from "../utils.js"
import {useState, useEffect, useCallback} from 'react';

export function OrderComponent() {
    document.title="OnlineShop - Commande";
    const [cartItemsLength, setCartItems] = useState(0);
    
    const [order, setOrder] = useState({
        "id" : 0,
        "firstName" : "",
        "lastName" : "",
        "email" : "",
        "phone" : "",
        "products" : []
    });

    const handleSubmit = (evt) => {
      return fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
        credentials: 'include'
      });
    }

    const changeProperty = useCallback((name, value) => {
      const newOrder = order;
      newOrder[name] = value;  
      setOrder(newOrder);
    }, [order])
        
    useEffect(() => {
        const fetchDataShoppingCart = async () => {
            try {
                const ans = await fetch("http://localhost:4000/api/shopping-cart", {credentials: 'include'});
                if(ans.ok) {
                    const items = await ans.json();
                    setCartItems(calculateTotalCartItems(items));
                    changeProperty("products", items.map(item => {
                        return {
                          id: item.productId,
                          quantity: item.quantity
                        }
                      }));
                } else {
                    throw ans.json();
                }
            } catch(e) {
                console.error(e);
            }
        }
        const fetchDataOrder = async () => {
          try {
              const ans = await fetch("http://localhost:4000/api/orders");
              if(ans.ok) {
                  const orders = await ans.json();
                  changeProperty("id", orders.length);
              } else {
                  throw ans.json();
              }
          } catch(e) {
              console.error(e);
          }
        }
        fetchDataShoppingCart();
        fetchDataOrder();
    }, [changeProperty]);

    return (
        <div>
            <Header cartCount={cartItemsLength}/>
            <main>
                <article>
                  <h1>Commande</h1>
                  <form id="order-form" action="/confirmation" method="get" onSubmit={handleSubmit}>
                    <section>
                      <h2>Contact</h2>
                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="firstName">Prénom</label>
                            <input className="form-control" type="text" id="firstName" name="firstName" placeholder="Prénom" minLength="2" onChange={e => changeProperty(e.target.name, e.target.value)} required/>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="lastName">Nom</label>
                            <input className="form-control" type="text" id="lastName" name="lastName" placeholder="Nom" minLength="2" onChange={e => changeProperty(e.target.name, e.target.value)} required/>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="email">Adresse courriel</label>
                            <input className="form-control" type="email" id="email" name="email" placeholder="Adresse courriel" onChange={e => changeProperty(e.target.name, e.target.value)} required/>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="phone">Téléphone</label>
                            <input className="form-control" type="tel" id="phone" name="phone" placeholder="###-###-####" onChange={e => changeProperty(e.target.name, e.target.value)} required/>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section>
                      <h2>Paiement</h2>
                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="credit-card">Numéro de carte de crédit</label>
                            <input className="form-control" type="text" id="credit-card" name="credit-card" placeholder="•••• •••• •••• ••••" required
                                   pattern="(^4[0-9]{12}(?:[0-9]{3})?$)|(^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$)|(3[47][0-9]{13})|(^3(?:0[0-5]|[68][0-9])[0-9]{11}$)|(^6(?:011|5[0-9]{2})[0-9]{12}$)|(^(?:2131|1800|35\d{3})\d{11}$)"/>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="credit-card-expiry">Expiration (mm/aa)</label>
                            <input className="form-control" type="text" id="credit-card-expiry" name="credit-card-expiry" placeholder="mm/aa" required
                                   pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})"/>
                          </div>
                        </div>
                      </div>
                    </section>
                    <button className="btn pull-right" type="submit">Payer <i className="fa fa-angle-double-right"></i></button>
                  </form>
                </article>
              </main>
            <Footer/>
        </div>
    );
}
