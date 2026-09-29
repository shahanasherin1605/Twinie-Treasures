import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { api } from "./api";

export default function Profile() {
  const { user, authLoading, updateProfile, signOut } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.id) api("/orders").then(({ orders: orderHistory }) => setOrders(orderHistory)).catch((loadError) => setError(loadError.message));
  }, [user?.id]);

  useEffect(() => {
    if (user) setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    updateProfile(formData).then(() => setSaved(true)).catch((saveError) => setError(saveError.message)).finally(() => setBusy(false));
  };

  if (authLoading) return <main className="page"><p>Loading your account…</p></main>;
  if (!user) return <main className="page empty-state"><h1>Your account, your orders.</h1><p>Sign in to view saved details and order updates.</p><Link className="button button-yellow" to="/login">Sign in</Link></main>;

  return (
    <main className="page profile-page">
      <section className="page-intro">
        <div>
          <p className="eyebrow">YOUR ACCOUNT</p><h1>Good to see you, {user.name.split(" ")[0]}.</h1><p>Manage your delivery details and keep up with your orders.</p>
          <button className="text-button sign-out-button" onClick={() => signOut().then(() => navigate("/"))}>Sign out</button>
        </div>
      </section>

      <section className="profile-grid">
        <article className="profile-card">
          <h3>Saved profile</h3>
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" value={formData.name} onChange={handleChange} />
            </label>
            <label>
              Email
              <input name="email" type="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
              Phone number
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </label>
            <label>
              Address
              <textarea name="address" rows="4" value={formData.address} onChange={handleChange} />
            </label>
            <button type="submit" className="button button-yellow" disabled={busy}>{busy ? "Saving…" : "Save delivery details"}</button>
            {saved && <p className="saved-note" role="status">Your details are saved to your account.</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>
        </article>

        <article className="profile-card activity-card">
          <div className="activity-header">
            <h3>Your orders</h3>
            <span>{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
          </div>
          <div className="activity-list">
            {orders.map((order) => <article key={order.id} className="order-item">
              <div className="order-heading"><div><p className="activity-action">Order {order.id}</p><p className="activity-detail">{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {order.status}</p></div><strong>₹{order.total}</strong></div>
              <div className="order-products">{order.items.map((item) => <div key={item.id}><img src={item.image} alt="" /><span>{item.name} · {item.size}</span><small>× {item.qty}</small></div>)}</div>
              <p className="activity-detail">{order.paymentMethod.toUpperCase()} · {order.paymentStatus}</p>
            </article>)}
            {orders.length === 0 && <div className="orders-empty"><p>No orders just yet.</p><Link to="/frames">Find your first frame →</Link></div>}
          </div>
        </article>
      </section>
    </main>
  );
}
