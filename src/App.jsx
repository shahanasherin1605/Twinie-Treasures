import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Frames from "./frames";
import CartPage from "./cart";
import Profile from "./profile";
import Login from "./login";
import Checkout from "./checkout";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frames" element={<Frames />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
}

export default App;
