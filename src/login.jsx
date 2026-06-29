import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function Login() {
  const { user, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: "",
  });
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile({
      name: formData.name || "Twinie Shopper",
      email: formData.email,
      phone: formData.phone,
    });
    setSaved(true);
    navigate("/profile");
  };

  return (
    <main className="page login-page">
      <section className="page-intro">
        <div>
          <p className="breadcrumb">Home / Login</p>
          <h2>Log in to Twinie Treasures</h2>
          <p>Enter your details once and they will be saved for future visits.</p>
        </div>
      </section>

      <section className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} />
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" className="btn-primary">
            Log In & Save Info
          </button>
          {saved && <p className="saved-note">Login details saved successfully.</p>}
        </form>
      </section>
    </main>
  );
}
