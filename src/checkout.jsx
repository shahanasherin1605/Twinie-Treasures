import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useUser } from "./UserContext";

export default function Checkout() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    clearCart();
    navigate("/", { replace: true });
  };

  return (
    <main className="page checkout-page">
      <section className="page-intro">
        <div>
          <p className="breadcrumb">Home / Checkout</p>
          <h2>Checkout</h2>
          <p>Review your order and choose a payment method to complete your purchase.</p>
        </div>
      </section>

      <section className="checkout-grid">
        <article className="checkout-card">
          <h3>Shipping & contact</h3>
          <div className="checkout-field">
            <span>Name</span>
            <strong>{user.name || "Not provided"}</strong>
          </div>
          <div className="checkout-field">
            <span>Phone</span>
            <strong>{user.phone || "Not provided"}</strong>
          </div>
          <div className="checkout-field">
            <span>Address</span>
            <strong>{user.address || "Not provided"}</strong>
          </div>
        </article>

        <article className="checkout-card">
          <h3>Payment options</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="netbanking"
                checked={paymentMethod === "netbanking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Netbanking
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>
        </article>
      </section>

      <section className="checkout-summary-section">
        <div className="checkout-summary-card">
          <h3>Order summary</h3>
          <p>{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          <p className="summary-price">₹{totalPrice}</p>
          <p className="payment-note">Payment method: {paymentMethod.toUpperCase()}</p>
          <button className="btn-primary place-order" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </section>
    </main>
  );
}
