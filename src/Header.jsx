import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useUser } from "./UserContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/frames${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <header className="store-header">
      <div className="header-main">
        <Link className="store-brand" to="/" aria-label="Twinie Treasures home">
          <span className="brand-mark">tt</span>
          <span><strong>TWINIE</strong><small>TREASURES</small></span>
        </Link>
        <form className="store-search" onSubmit={handleSearch} role="search">
          <label className="sr-only" htmlFor="store-search">Search frames</label>
          <input id="store-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search frames, finishes, sizes" />
          <button aria-label="Search">⌕</button>
        </form>
        <Link className="account-link" to={user ? "/profile" : "/login"}>
          <small>{user ? "Hello," : "Welcome,"}</small><strong>{user ? user.name.split(" ")[0] : "Sign in"}</strong>
        </Link>
        <Link className="cart-link" to="/cart" aria-label={`Cart with ${totalItems} items`}>
          <span className="cart-icon">▱</span><strong>Cart</strong><span className="cart-count">{totalItems}</span>
        </Link>
      </div>
      <nav className="header-subnav" aria-label="Main navigation">
        <Link to="/frames">Shop all frames</Link><Link to="/frames?finish=Wood">Wood collection</Link><Link to="/frames?finish=Gold">Gift-worthy picks</Link><span>Thoughtfully made for your favorite moments</span>
      </nav>
    </header>
  );
}
