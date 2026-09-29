import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useUser } from "./UserContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useUser();
  const hasRequiredInfo = Boolean(user?.phone && user?.address);

  return (
    <main className="page cart-page">
      <section className="page-intro"><div><p className="eyebrow">YOUR BAG</p><h1>Your cart</h1><p>{totalItems} item{totalItems !== 1 ? "s" : ""} saved for later.</p></div></section>

      {items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is taking a breather.</h2><p>Pick a frame and give a favorite moment a place to live.</p><Link to="/frames" className="button button-yellow">Browse frames</Link>
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
                    <p className="cart-item-meta">{item.size} · {item.finish} finish</p>
                    <p className="cart-item-price">₹{item.price}</p>
                    <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                      <button aria-label="Decrease quantity" onClick={() => item.qty === 1 ? removeItem(item.id) : updateQuantity(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button aria-label="Increase quantity" disabled={item.qty >= 20} onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                    </div>
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
              <div className="summary-line"><span>Items ({totalItems})</span><strong>₹{totalPrice}</strong></div>
              <div className="summary-line"><span>Delivery</span><strong className="free-delivery">FREE</strong></div>
              <div className="summary-line summary-total"><span>Subtotal</span><strong className="summary-price">₹{totalPrice}</strong></div>
              {hasRequiredInfo ? (
                <Link to="/checkout" className="button button-yellow">Proceed to checkout</Link>
              ) : (
                <div className="checkout-warning">
                  <p>{user ? "Add a phone number and delivery address before checkout." : "Sign in and add your delivery details to continue."}</p>
                  <Link to={user ? "/profile" : "/login"} className="button button-outline">{user ? "Add delivery details" : "Sign in to continue"}</Link>
                </div>
              )}
              <button className="text-button" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}
