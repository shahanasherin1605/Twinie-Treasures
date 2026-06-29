import React from "react";

export default function Home() {
  return (
    <div>

      {/* ✅ Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>CHERISH YOUR MEMORIES</h1>
          <p>Beautiful Frames For Every Memory</p>
          <p>
            Handcrafted photo frames in different sizes and colors to decorate
            your precious moments.
          </p>
          <a href="/frames" className="btn-primary shop-now-link">SHOP NOW</a>
        </div>
        <div className="hero-image">
          <img
            src="src/b5332377cd41ac21a550384a00b61a37.jpg"
            alt="Photo Frame Banner"
          />
        </div>
      </section>

      {/* ✅ Shop By Size */}
      <section className="shop-options">
        <div className="options-grid">
          <button>4 × 6 Inches</button>
          <button>5 × 7 Inches</button>
          <button>6 × 8 Inches</button>
          <button>8 × 10 Inches</button>
          <button>A4 Size</button>
          <button>A3 Size</button>
          <button>Custom Size</button>
        </div>
      </section>

      {/* ✅ Shop By Color */}
      <section className="shop-options">
        <div className="options-grid">
          <button>Black</button>
          <button>White</button>
          <button>Wooden</button>
          <button>Golden</button>
          <button>Silver</button>
          <button>Rose Gold</button>
          <button>Pink</button>
          <button>Blue</button>
          <button>All Colors</button>
        </div>
      </section>

      {/* ✅ Popular Frames */}
      <section className="featured">
        <div className="grid">
          <div className="card">
            <img
              src="src/89b35d8f22e78e97ff86ae8ca6963d3f.jpg"
              alt="Classic Black Frame"
            />
            <h3>Classic Black Frame</h3>
            <p>8 × 10 Inches</p>
            <p>₹599</p>
            <p>⭐ 128 reviews</p>
          </div>
          <div className="card">
            <img
              src="src/89b35d8f22e78e97ff86ae8ca6963d3f - Copy.jpg"
              alt="Elegant White Frame"
            />
            <h3>Elegant White Frame</h3>
            <p>5 × 7 Inches</p>
            <p>₹499</p>
            <p>⭐ 98 reviews</p>
          </div>
          <div className="card">
            <img
              src="src/dbd4f2e08650c97424786bbb456b9175.jpg"
              alt="Premium Wooden Frame"
            />
            <h3>Premium Wooden Frame</h3>
            <p>A4 Size</p>
            <p>₹699</p>
            <p>⭐ 156 reviews</p>
          </div>
          <div className="card">
            <img
              src="src/0472d39f48717c36431ef1614e026cb8.jpg"
              alt="Royal Golden Frame"
            />
            <h3>Royal Golden Frame</h3>
            <p>8 × 10 Inches</p>
            <p>₹799</p>
            <p>⭐ 110 reviews</p>
          </div>
        </div>
      </section>
    </div>
  );
}

