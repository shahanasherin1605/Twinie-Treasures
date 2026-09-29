const frameTemplates = [
  {
    id: "white-frame",
    name: "Gallery White Photo Frame",
    basePrice: 499,
    image: "/frames/gallery-white.jpg",
    description: "A crisp, timeless profile that lets your favorite photographs take center stage.",
    finish: "White",
  },
  {
    id: "black-frame",
    name: "Classic Black Photo Frame",
    basePrice: 549,
    image: "/frames/classic-black.jpg",
    description: "A clean matte finish with a gallery look for portraits and bold prints.",
    finish: "Black",
  },
  {
    id: "wooden-frame",
    name: "Natural Oak Photo Frame",
    basePrice: 649,
    image: "/frames/natural-oak.jpg",
    description: "Warm natural grain brings a little softness to shelves, desks, and walls.",
    finish: "Wood",
  },
  {
    id: "checked-frame",
    name: "Textured Wood Photo Frame",
    basePrice: 699,
    image: "/frames/textured-wood.jpg",
    description: "A tactile checked finish for a thoughtful, handcrafted display.",
    finish: "Wood",
  },
  {
    id: "brown-frame",
    name: "Walnut Photo Frame",
    basePrice: 679,
    image: "/frames/natural-oak.jpg",
    description: "A rich walnut tone that pairs beautifully with warm and classic interiors.",
    finish: "Brown",
  },
  {
    id: "golden-frame",
    name: "Brushed Gold Photo Frame",
    basePrice: 799,
    image: "/frames/brushed-gold.jpg",
    description: "A subtle gold accent for certificates, celebrations, and standout memories.",
    finish: "Gold",
  },
];

const sizeVariants = [
  { key: "4x6", label: "4 × 6 in", priceAdjustment: 0 },
  { key: "5x7", label: "5 × 7 in", priceAdjustment: 50 },
  { key: "6x8", label: "6 × 8 in", priceAdjustment: 100 },
  { key: "8x10", label: "8 × 10 in", priceAdjustment: 150 },
  { key: "a4", label: "A4", priceAdjustment: 180 },
  { key: "a3", label: "A3", priceAdjustment: 240 },
];

export const products = frameTemplates.flatMap((frame) =>
  sizeVariants.map((size, index) => ({
    id: `${frame.id}-${size.key}`,
    name: frame.name,
    price: frame.basePrice + size.priceAdjustment,
    size: size.label,
    image: frame.image,
    description: frame.description,
    finish: frame.finish,
    rating: Number((4.6 + ((index + frame.name.length) % 4) / 10).toFixed(1)),
    reviews: 38 + frame.name.length * 7 + index * 13,
    stock: 18 + ((index * 3 + frame.name.length) % 20),
  }))
);