import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useUser } from "./UserContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, clearCart } = useCart();
  const { user } = useUser();
  const hasRequiredInfo = Boolean(user.phone && user.address);

  return (
    <main className="page cart-page">
      <section className="page-intro">
        <div>
          <p className="breadcrumb">Home / Cart</p>
          <h2>Your Cart</h2>
          <p>{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart.</p>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Add a frame from the Frames page to see it here.</p>
        </div>
      ) : (
        <section className="cart-list">
          <div className="cart-items">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <div className="item-left">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p className="cart-item-meta">{item.size}</p>
                    <p className="cart-item-meta">₹{item.price} × {item.qty}</p>
                  </div>
                </div>
                <button className="remove-button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <div className="summary-card">
              <h3>Order summary</h3>
              <p>{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
              <p className="summary-price">₹{totalPrice}</p>
              {hasRequiredInfo ? (
                <Link to="/checkout" className="btn-primary">
                  Proceed to Checkout
                </Link>
              ) : (
                <div className="checkout-warning">
                  <p>Please provide your phone number and address in your profile before placing an order.</p>
                  <Link to="/profile" className="btn-primary">
                    Complete Profile
                  </Link>
                </div>
              )}
              <button className="btn-secondary" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}
