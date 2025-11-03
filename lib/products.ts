export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
  features: string[]
  sizes: string[]
  colors: string[]
}

export const productData: Product[] = [
  { 
    id: 1, 
    name: "Mountain Fleece Jacket", 
    price: 89.99, 
    category: "clothing", 
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&auto=format",
    description: "Stay warm and comfortable in our premium Mountain Fleece Jacket. Made from high-quality fleece material that provides excellent insulation while remaining breathable. Perfect for hiking, camping, or casual everyday wear.",
    features: [
      "Premium fleece material",
      "Moisture-wicking technology",
      "Zippered pockets",
      "Elastic cuffs for fit",
      "Available in multiple colors"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Navy Blue", "Forest Green", "Charcoal Gray", "Burgundy"]
  },
  { 
    id: 2, 
    name: "Waterproof Hiking Pants", 
    price: 79.99, 
    category: "clothing", 
    image: "https://forloh.com/cdn/shop/files/FORLOH-Mens-AllClima-3L-Rain-Pant-Green-front-angle.jpg?v=1756134623",
    description: "Conquer any trail with our Waterproof Hiking Pants. Designed with advanced waterproof technology and reinforced knees, these pants are built to withstand the elements while providing maximum comfort and mobility.",
    features: [
      "100% waterproof construction",
      "Reinforced knees and seat",
      "Multiple storage pockets",
      "Adjustable waistband",
      "Lightweight and packable"
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Khaki", "Olive Green", "Stone Gray", "Navy Blue"]
  },
  { 
    id: 3, 
    name: "Trail Hiking Boots", 
    price: 149.99, 
    category: "shoes", 
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop&auto=format",
    description: "Experience superior traction and support with our Trail Hiking Boots. Featuring advanced grip technology and waterproof construction, these boots are designed for serious hikers who demand performance and durability.",
    features: [
      "Vibram® outsole for superior grip",
      "Waterproof leather construction",
      "Ankle support technology",
      "Cushioned insole for comfort",
      "Breathable lining"
    ],
    sizes: ["7", "8", "9", "10", "11", "12", "13"],
    colors: ["Brown Leather", "Black", "Dark Brown"]
  },
  { 
    id: 4, 
    name: "Performance Base Layer", 
    price: 39.99, 
    category: "clothing", 
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop&auto=format",
    description: "Our Performance Base Layer is engineered to keep you dry and comfortable during intense activities. Made from merino wool blend that regulates temperature and wicks moisture away from your skin.",
    features: [
      "Merino wool blend",
      "Moisture-wicking technology",
      "Odor-resistant",
      "Seamless construction",
      "Four-way stretch"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Charcoal"]
  },
  { 
    id: 5, 
    name: "All-Terrain Running Shoes", 
    price: 119.99, 
    category: "shoes", 
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&auto=format",
    description: "Transition seamlessly from road to trail with our All-Terrain Running Shoes. Featuring responsive cushioning and aggressive traction patterns, these shoes are perfect for runners who explore diverse landscapes.",
    features: [
      "Responsive foam cushioning",
      "Aggressive trail-ready outsole",
      "Breathable mesh upper",
      "Rock protection plate",
      "Secure lace system"
    ],
    sizes: ["7", "8", "9", "10", "11", "12", "13"],
    colors: ["Blue/Orange", "Black/Green", "Gray/Red"]
  },
  { 
    id: 6, 
    name: "Wool Beanie", 
    price: 29.99, 
    category: "accessories", 
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop&auto=format",
    description: "Keep warm in style with our premium Wool Beanie. Made from 100% merino wool, this beanie provides excellent warmth without bulk and is perfect for cold weather adventures.",
    features: [
      "100% merino wool",
      "Breathable and warm",
      "One size fits all",
      "Soft and non-itchy",
      "Machine washable"
    ],
    sizes: ["One Size"],
    colors: ["Charcoal", "Navy", "Forest Green", "Burgundy", "Cream"]
  }
]

export function getProductById(id: number): Product | undefined {
  return productData.find(product => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return productData.filter(product => product.category === category)
}

export function getFeaturedProducts(count: number = 3): Product[] {
  return productData.slice(0, count)
}

export function getAllProducts(): Product[] {
  return productData
}
