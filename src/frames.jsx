import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const frameTemplates = [
  {
    id: "white-frame",
    name: "White Frame",
    basePrice: 499,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    description: "Classic white frame with a clean profile for modern homes and bright photo layouts.",
    note: "Available in multiple sizes with anti-glare glass and sturdy backing.",
  },
  {
    id: "black-frame",
    name: "Black Frame",
    basePrice: 549,
    image: "https://images.unsplash.com/photo-1514474959185-56c8e4705ad5",
    description: "Bold black matte frame that makes colors pop and adds a gallery-style finish.",
    note: "Includes premium mounting hardware and a protective glass cover.",
  },
  {
    id: "wooden-frame",
    name: "Wooden Frame",
    basePrice: 649,
    image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0",
    description: "Warm natural wood frame for portraits, landscapes, and decor with a rustic touch.",
    note: "Solid wood finish with clear glass, perfect for tabletop or wall display.",
  },
  {
    id: "wooden-checked-frame",
    name: "Wooden Checked Frame",
    basePrice: 699,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    description: "Stylish checked wood frame with textured detail for a unique handcrafted look.",
    note: "Features sturdy construction, elegant finish, and premium glass protection.",
  },
  {
    id: "brown-frame",
    name: "Brown Frame",
    basePrice: 679,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156",
    description: "Rich brown finish with textured wood grain, ideal for classic and warm interiors.",
    note: "Elegant profile, secure backing, and glass protection for every print.",
  },
  {
    id: "golden-frame",
    name: "Golden Frame",
    basePrice: 799,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    description: "Premium gold accent frame for awards, certificates, and standout wall art.",
    note: "Luxurious metallic finish, tempered glass, and easy wall mounting kit included.",
  },
];

const sizeVariants = [
  { key: "4x6", label: "4 × 6 Inches", priceAdjustment: 0 },
  { key: "5x7", label: "5 × 7 Inches", priceAdjustment: 50 },
  { key: "6x8", label: "6 × 8 Inches", priceAdjustment: 100 },
  { key: "8x10", label: "8 × 10 Inches", priceAdjustment: 150 },
  { key: "a4", label: "A4 Size", priceAdjustment: 180 },
  { key: "a3", label: "A3 Size", priceAdjustment: 240 },
];

const frameProducts = frameTemplates.flatMap((template) =>
  sizeVariants.map((size) => ({
    id: `${template.id}-${size.key}`,
    name: template.name,
    price: template.basePrice + size.priceAdjustment,
    size: size.label,
    image: template.image,
    description: template.description,
    note: template.note,
  }))
);

export default function Frames() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleBuyNow = (product) => {
    addItem(product);
    navigate("/cart");
  };

  return (
    <main className="page frames-page">
      <section className="page-intro">
        <div>
          <p className="breadcrumb">Home / Frames</p>
          <h2>Premium Photo Frames</h2>
          <p>Choose high-quality frames with detailed size specs, premium finishes, and fast shipping — styled like a top ecommerce listing.</p>
        </div>
      </section>

      <section className="frame-options">
        <div className="option-group">
          <h3>Frame types</h3>
          <div className="option-list">
            <button>White Frame</button>
            <button>Black Frame</button>
            <button>Wooden Frame</button>
            <button>Wooden Checked Frame</button>
            <button>Brown Frame</button>
            <button>Golden Frame</button>
          </div>
        </div>

        <div className="option-group">
          <h3>Available sizes</h3>
          <div className="option-list">
            <button>4 × 6 Inches</button>
            <button>5 × 7 Inches</button>
            <button>6 × 8 Inches</button>
            <button>8 × 10 Inches</button>
            <button>A4 Size</button>
            <button>A3 Size</button>
          </div>
        </div>
      </section>

      <section className="frames-grid">
        {frameProducts.map((product) => (
          <article key={product.id} className="frame-card">
            <img src={product.image} alt={product.name} />
            <div className="frame-copy">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="specs-row">
                <span className="badge">{product.size}</span>
                <span className="price">₹{product.price}</span>
              </div>
              <p className="frame-note">{product.note}</p>
              <div className="product-actions">
                <button className="btn-secondary" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
                <button className="btn-primary" onClick={() => handleBuyNow(product)}>
                  Buy Now
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
