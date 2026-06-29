import React from "react";
import { Link } from "react-router-dom";
import logoImg from "./assets/hero.png";

export default function Header() {
  return (
    <header className="site-header">
      <div className="logo">
        <img src={logoImg} alt="Twinie Treasures logo" className="logo-img" />
        <div className="brand">
          <h1>Twinie Treasures</h1>
          <p>Memory Store</p>
        </div>
      </div>

      <nav className="nav-menu">
        <Link to="/">Home</Link>
        <Link to="/frames">Frames</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
      </nav>

      <div className="nav-actions">
        <Link to="/cart" className="cart-link">Cart</Link>
      </div>
    </header>
  );
}
