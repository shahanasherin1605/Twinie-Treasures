import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "./api";
import ProductCard from "./ProductCard";
import heroPhoto from "./b5332377cd41ac21a550384a00b61a37.jpg";

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api("/products").then(({ products: catalog }) => setProducts(catalog.slice(0, 4))).catch(() => {}); }, []);

  return (
    <main>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">A LITTLE ROOM FOR WHAT MATTERS</p>
          <h1>Keep your<br />favorite moments<br /><em>in the picture.</em></h1>
          <p>Thoughtful frames, made for the photos you never scroll past.</p>
          <Link to="/frames" className="button button-yellow">Shop photo frames <span aria-hidden="true">→</span></Link>
          <div className="hero-assurance"><span>✓</span> Carefully packed <span>·</span> Ready to gift</div>
        </div>
        <div className="hero-photo" style={{ backgroundImage: `linear-gradient(90deg, rgba(20, 33, 30, .08), rgba(20, 33, 30, .05)), url("${heroPhoto}")` }} role="img" aria-label="A framed family photograph displayed at home">
          <div className="hero-note"><strong>Make it yours.</strong><span>Choose a finish. Find the right size.</span></div>
        </div>
        <div className="hero-index">01 <span>/</span> 03</div>
      </section>

      <section className="benefit-strip" aria-label="Shop benefits">
        <div><span className="benefit-icon">01</span><p><strong>Made to last</strong><small>Considered materials, clean finish</small></p></div>
        <div><span className="benefit-icon">02</span><p><strong>Sizes that fit</strong><small>From desk-size to statement piece</small></p></div>
        <div><span className="benefit-icon">03</span><p><strong>Gift ready</strong><small>Carefully packed for giving</small></p></div>
      </section>

      <section className="home-products section-wrap">
        <div className="section-heading"><div><p className="eyebrow">A GOOD PLACE TO START</p><h2>Frames worth keeping.</h2></div><Link to="/frames">View all frames <span aria-hidden="true">→</span></Link></div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="home-quote"><span>“</span><p>Some things deserve a place on the wall, not just in your camera roll.</p><Link to="/frames">Find your frame <span aria-hidden="true">→</span></Link></section>
    </main>
  );
}

