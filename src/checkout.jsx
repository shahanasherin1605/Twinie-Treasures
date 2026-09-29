import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useUser } from "./UserContext";
import { api } from "./api";

export default function Checkout() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setBusy(true);
    setError("");
    try {
      const { order } = await api("/orders", { method: "POST", body: { items: items.map(({ id, qty }) => ({ id, qty })), paymentMethod } });
      clearCart();
      setPlacedOrder(order);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  };

  if (placedOrder) return <main className="page checkout-page"><section className="order-success"><span className="success-mark">✓</span><p className="eyebrow">ORDER CONFIRMED</p><h1>It’s in good hands.</h1><p>Order <strong>{placedOrder.id}</strong> has been placed. We’ll send updates to {user.email}.</p><Link className="button button-yellow" to="/profile">View your orders</Link><Link className="text-button" to="/frames">Continue shopping</Link></section></main>;

  return (
    <main className="page checkout-page">
      <section className="page-intro">
        <div>
          <p className="eyebrow">ALMOST YOURS</p><h1>Checkout</h1><p>Confirm delivery and payment details for your order.</p>
        </div>
      </section>

      <section className="checkout-grid">
        <article className="checkout-card">
          <h3>Delivering to</h3>
          <div className="checkout-field">
            <span>Name</span>
            <strong>{user?.name || "Not provided"}</strong>
          </div>
          <div className="checkout-field">
            <span>Phone</span>
            <strong>{user?.phone || "Not provided"}</strong>
          </div>
          <div className="checkout-field">
            <span>Address</span>
            <strong>{user?.address || "Not provided"}</strong>
          </div>
          <Link className="text-button" to="/profile">Edit delivery details</Link>
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
              Card <span className="payment-hint">Demo only; no payment is charged</span>
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI <span className="payment-hint">Demo only; no payment is charged</span>
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="netbanking"
                checked={paymentMethod === "netbanking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Netbanking <span className="payment-hint">Demo only; no payment is charged</span>
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on delivery
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
          {error && <p className="form-error" role="alert">{error}</p>}
          <p className="payment-disclaimer">Online payments are recorded as demo orders only. Use COD for a real-world trial without charging a card.</p>
          <button className="button button-yellow place-order" onClick={handlePlaceOrder} disabled={busy || !items.length || !user?.phone || !user?.address}>
            {busy ? "Placing order…" : "Place your order"}
          </button>
        </div>
      </section>
    </main>
  );
}
