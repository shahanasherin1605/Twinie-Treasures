import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Header from "./Header";
import Home from "./home";
import Frames from "./frames";
import CartPage from "./cart";
import Profile from "./profile";
import Login from "./login";
import Checkout from "./checkout";
import About from "./about";
import Contact from "./contact";
import { api } from "./api";
import "./App.css";

function App() {
  const [databaseReady, setDatabaseReady] = useState(null);

  useEffect(() => {
    api("/health").then(() => setDatabaseReady(true)).catch(() => setDatabaseReady(false));
  }, []);

  return (
    <div className="App">
      <Header />
      {databaseReady === false && <div className="database-notice" role="status">Catalog preview only. Configure MySQL in `.env` to enable accounts and checkout.</div>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frames" element={<Frames />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<main className="empty-state"><h1>Page not found</h1><a href="/">Back to home</a></main>} />
      </Routes>
      <footer className="store-footer"><Link className="footer-brand" to="/">Twinie Treasures</Link><span>Frames for the moments you keep.</span><nav><Link to="/about">Our story</Link><Link to="/contact">Contact</Link><Link to="/frames">Shop frames</Link></nav><small>© {new Date().getFullYear()} Twinie Treasures</small></footer>
    </div>
  );
}

export default App;
