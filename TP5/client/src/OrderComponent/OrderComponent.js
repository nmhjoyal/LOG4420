
import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import {useState, useEffect} from 'react';

export function OrderComponent() {
    document.title="OnlineShop - Commande";
    
    const [order, setOrder] = useState({
        "id" : 0,
        "firstName" : "",
        "lastName" : "",
        "email" : "",
        "phone" : "",
        "products" : []
    });

    const handleSubmit = (evt) => {
      console.log(`hello`);
      return fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order)
      });
    }
        
    useEffect(() => {
        const fetchData = async () => {
            try {
                const item = await fetch("http://localhost:4000/api/shopping-cart", {withCredentials: true });
                if(item.ok) {
                    const items = await item.json();
                    setOrder({"products" : items.map(item => {
                        return {
                          id: item.product.id,
                          quantity: item.quantity
                        }
                      })});
                } else {
                    throw item.json();
                }
            } catch(e) {
                console.error(e);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <Header/>
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
                            <input className="form-control" type="text" id="firstName" name="firstName" placeholder="Prénom" minLength="2" onChange={e => setOrder({[e.target.name] : e.target.value})} required/>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="lastName">Nom</label>
                            <input className="form-control" type="text" id="lastName" name="lastName" placeholder="Nom" minLength="2" onChange={e => setOrder({[e.target.name] : e.target.value})} required/>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="email">Adresse courriel</label>
                            <input className="form-control" type="email" id="email" name="email" placeholder="Adresse courriel" onChange={e => setOrder({[e.target.name] : e.target.value})} required/>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="phone">Téléphone</label>
                            <input className="form-control" type="tel" id="phone" name="phone" placeholder="###-###-####" onChange={e => setOrder({[e.target.name] : e.target.value})} required/>
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
                            <input className="form-control" type="text" id="credit-card" name="credit-card" placeholder="•••• •••• •••• ••••" onChange={e => setOrder({[e.target.name] : e.target.value})} required/>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="credit-card-expiry">Expiration (mm/aa)</label>
                            <input className="form-control" type="text" id="credit-card-expiry" name="credit-card-expiry" placeholder="mm/aa" onChange={e => setOrder({[e.target.name] : e.target.value})} required/>
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
