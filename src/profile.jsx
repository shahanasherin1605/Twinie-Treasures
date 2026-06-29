import React, { useEffect, useState } from "react";
import { useUser } from "./UserContext";

const userActivity = [
  { id: 1, action: "Ordered White Frame", detail: "Order #3472 completed", date: "2026-06-20" },
  { id: 2, action: "Added Black Frame to cart", detail: "3 items in cart", date: "2026-06-22" },
  { id: 3, action: "Viewed Golden Frame", detail: "Browsed premium frames", date: "2026-06-24" },
];

export default function Profile() {
  const { user, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData({
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
    updateProfile(formData);
    setSaved(true);
  };

  return (
    <main className="page profile-page">
      <section className="page-intro">
        <div>
          <p className="breadcrumb">Home / Profile</p>
          <h2>Your Profile</h2>
          <p>Manage your account and save your address and phone number once for future orders.</p>
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
            <button type="submit" className="btn-primary">Save profile</button>
            {saved && <p className="saved-note">Profile updated successfully.</p>}
          </form>
        </article>

        <article className="profile-card activity-card">
          <div className="activity-header">
            <h3>Recent activity</h3>
            <span>{userActivity.length} items</span>
          </div>
          <div className="activity-list">
            {userActivity.map((item) => (
              <div key={item.id} className="activity-item">
                <div>
                  <p className="activity-action">{item.action}</p>
                  <p className="activity-detail">{item.detail}</p>
                </div>
                <span className="activity-date">{item.date}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
