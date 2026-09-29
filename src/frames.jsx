import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "./api";
import ProductCard from "./ProductCard";

export default function Frames() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const finish = searchParams.get("finish") || "All finishes";
  const sort = searchParams.get("sort") || "featured";

  useEffect(() => {
    api("/products").then(({ products: catalog }) => setProducts(catalog)).catch((error) => setLoadError(error.message));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description} ${product.finish} ${product.size}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (finish === "All finishes" || product.finish === finish);
  }).sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name));

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "All finishes" || !value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <main className="page catalog-page">
      <div className="catalog-heading">
        <div><p className="eyebrow">THE FRAME SHOP</p><h1>Find a frame for it.</h1><p>Made to hold the moments you want to keep close.</p></div>
        <p className="catalog-count">{filteredProducts.length} results</p>
      </div>
      <section className="catalog-toolbar" aria-label="Product filters">
        <div className="finish-filters">
          {["All finishes", "White", "Black", "Wood", "Brown", "Gold"].map((value) => (
            <button key={value} className={finish === value ? "filter-chip is-active" : "filter-chip"} onClick={() => updateFilter("finish", value)}>{value}</button>
          ))}
        </div>
        <label className="sort-control">Sort by
          <select value={sort} onChange={(event) => updateFilter("sort", event.target.value)}>
            <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option>
          </select>
        </label>
      </section>
      {query && <p className="search-result-label">Results for <strong>“{query}”</strong> <button onClick={() => updateFilter("q", "")}>Clear search</button></p>}
      {loadError && <p className="form-error" role="alert">{loadError}</p>}
      <section className="product-grid" aria-label="Photo frames">
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
      {!loadError && filteredProducts.length === 0 && <div className="empty-state"><h2>No frames found</h2><p>Try a different search or finish.</p><button className="button button-outline" onClick={() => setSearchParams({})}>Show all frames</button></div>}
    </main>
  );
}
