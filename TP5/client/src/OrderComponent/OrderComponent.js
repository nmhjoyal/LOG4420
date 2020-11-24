
import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"

export function OrderComponent() {
    document.title="OnlineShop - Commande";
    return (
        <div>
            <Header/>
            <main>
                <article>
                  <h1>Commande</h1>
                  <form id="order-form" action="/confirmation" method="get">
                    <section>
                      <h2>Contact</h2>
                      <div class="row">
                        <div class="col">
                          <div class="form-group">
                            <label for="first-name">Prénom</label>
                            <input class="form-control" type="text" id="first-name" name="first-name" placeholder="Prénom" minlength="2" required/>
                          </div>
                        </div>
                        <div class="col">
                          <div class="form-group">
                            <label for="last-name">Nom</label>
                            <input class="form-control" type="text" id="last-name" name="last-name" placeholder="Nom" minlength="2" required/>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="form-group">
                            <label for="email">Adresse courriel</label>
                            <input class="form-control" type="email" id="email" name="email" placeholder="Adresse courriel" required/>
                          </div>
                        </div>
                        <div class="col">
                          <div class="form-group">
                            <label for="phone">Téléphone</label>
                            <input class="form-control" type="tel" id="phone" name="phone" placeholder="###-###-####" required/>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section>
                      <h2>Paiement</h2>
                      <div class="row">
                        <div class="col">
                          <div class="form-group">
                            <label for="credit-card">Numéro de carte de crédit</label>
                            <input class="form-control" type="text" id="credit-card" name="credit-card" placeholder="•••• •••• •••• ••••" required/>
                          </div>
                        </div>
                        <div class="col">
                          <div class="form-group">
                            <label for="credit-card-expiry">Expiration (mm/aa)</label>
                            <input class="form-control" type="text" id="credit-card-expiry" name="credit-card-expiry" placeholder="mm/aa" required/>
                          </div>
                        </div>
                      </div>
                    </section>
                    <button class="btn pull-right" type="submit">Payer <i class="fa fa-angle-double-right"></i></button>
                  </form>
                </article>
              </main>
            <Footer/>
        </div>
    );
}
