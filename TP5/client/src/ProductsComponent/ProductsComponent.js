
import '../css/App.css';
import {Header} from "../_Common/Header.js"
import {Footer} from "../_Common/Footer.js"
import { SingleProductPart } from './SingleProductPart';
import { useEffect, useState } from 'react';
import { applyCategory, applySortingCriteria } from "./ProductsUtil.js"

export function ProductsComponent() {
    document.title="OnlineShop - Produits";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prod = await fetch("http://localhost:4000/api/products");
                if(prod.ok) {
                    setProducts(prod.json());
                } else {
                    throw prod.json();
                }
            } catch(e) {
                console.error(e);
            }
            setLoading(false);
        }
        fetchData();
    }, []);
    
    const [ cat, setCat] = useState("all")
    const [ sort, setSort ] = useState("price-asc");
    const [ currentProductList, setCurrentProductList] = useState(products);

    const changeCat = (newCat) => {
        if(cat !== newCat) {
            const newProductList = applyCategory(products, newCat);
            applySortingCriteria(newProductList, sort);
            setCat(newCat);
            setCurrentProductList(newProductList)    
        }
    }

    const changeSort = (newSort) => {
        if(sort !== newSort) {
            const newProductList = applyCategory(products, cat);
            applySortingCriteria(newProductList, sort);
            setSort(newSort);
            setCurrentProductList(newProductList);
        }
    }

    const categories = [
        {id: "cameras", text: "Appareils photo"},
        {id: "consoles", text: "Consoles"},
        {id: "screens", text: "Écrans"},
        {id: "computers", text: "Ordinateurs"},
        {id: "all", text: "Tous les produits"}
    ];

    const sorts = [
        {id: "price-asc", text: "Prix (bas-haut)"},
        {id: "price-dsc", text: "Prix (haut-bas)"},
        {id: "alpha-asc", text: "Nom (A-Z)"},
        {id: "alpha-dsc", text: "Nom (Z-A)"},
    ]

    return (
        <div className="PageNotFoundComponent">
            <Header currentActive="product"/>
            <main>
            <section className="sidebar" aria-label="Filtres">
            <section>
                <h2>Catégories</h2>
                <div className="btn-group vertical" id="product-categories">
                    {categories.map(catObj => 
                        <button 
                            key={catObj.id}
                            className={cat===catObj.id ? "active" : ""}
                            data-category={catObj.id}
                            onClick={() => changeCat(catObj.id)}
                        >
                            {catObj.text}
                        </button>
                    )}
                </div>
            </section>
            <section>
                <h2>Classement</h2>
                <div className="btn-group vertical" id="product-criteria">
                    {sorts.map(sortObj => 
                        <button 
                            key={sortObj.id}
                            className={cat===sortObj.id ? "active" : ""}
                            data-category={sortObj.id}
                            onClick={() => changeSort(sortObj.id)}
                        >
                            {sortObj.text}
                        </button>
                    )}
                </div>
            </section>
            </section>
            <article>
                <span className="right-header" id="products-count">{currentProductList.length} produits</span>
                <h1>Produits</h1>
                <div className="products" id="products-list">
                    {loading && <div className="loading"></div>}
                    {
                        currentProductList.map(p => 
                            <SingleProductPart key={p.id} productData={p}/>
                        )
                    }
                </div>
            </article>
        </main>
            <Footer/>
        </div>
    );
}
