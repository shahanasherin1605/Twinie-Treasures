import { useState } from "react";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="stock-label">{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</span>
      </div>
      <div className="product-copy">
        <p className="product-kicker">{product.finish} finish · {product.size}</p>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-rating"><span aria-label={`${product.rating} out of 5 stars`}>★ {product.rating.toFixed(1)}</span> <span>({product.reviews} reviews)</span></p>
        <p className="product-price">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price)}</p>
        <button className="button button-yellow product-add" onClick={handleAdd} disabled={product.stock < 1}>
          {added ? "Added to cart" : product.stock > 0 ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </article>
  );
}