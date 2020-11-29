import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import { useEffect, useState } from 'react';

export function ConfirmationComponent() {
  document.title="OnlineShop - Commande";
  const [name, setName] = useState("");
  const [confirmNum, setConfirmNum] = useState(0);

  useEffect(() => {
    const deleteShoppingCart = async () => {
      try {
        await fetch(`http://localhost:4000/api/shopping-cart`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: 'include'
        });
      } catch(e) {
          console.error(e);
      }
    }
    const fetchDataOrder = async () => {
      try {
          const ans = await fetch("http://localhost:4000/api/orders");
          if(ans.ok) {
              const orders = await ans.json();
              setConfirmNum(orders.length-1);
              try {
                const ans2 = await fetch("http://localhost:4000/api/orders/" + confirmNum);
                if(ans2.ok) {
                    const order = await ans2.json();
                    console.log(order);
                    setName(order.firstName + " " + order.lastName );
                  } else {
                    throw ans2.json();
                }
            } catch(e) {
                console.error(e);
            }
          } else {
              throw ans.json();
          }
      } catch(e) {
          console.error(e);
      }
    }
    deleteShoppingCart();
    fetchDataOrder();
  }, [confirmNum]);

  return (
    <div>
      <Header/>
      <main>
        <article>
          <h1>Votre commande est confirmée <span id="name">{name}</span>!</h1>
          <p>Votre numéro de confirmation est le <strong id="confirmation-number">{confirmNum}</strong>.</p>
        </article>
      </main>
      <Footer/>
    </div>
  );
}
