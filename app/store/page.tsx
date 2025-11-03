'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '../../components/ProductCard'
import { Product, getAllProducts } from '../../lib/products'

export default function Store() {
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    // Load cart count from localStorage
    const savedCart = localStorage.getItem('ecommerce-cart')
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      const totalItems = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartCount(totalItems)
    }
    
    const allProducts = getAllProducts()
    setProducts(allProducts)
    setFilteredProducts(allProducts)
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [searchTerm, category, priceRange, sortBy, products])

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Category filter
      const matchesCategory = !category || product.category === category
      
      // Price filter
      let matchesPrice = true
      if (priceRange === '0-50') {
        matchesPrice = product.price <= 50
      } else if (priceRange === '50-100') {
        matchesPrice = product.price > 50 && product.price <= 100
      } else if (priceRange === '100+') {
        matchesPrice = product.price > 100
      }
      
      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const addToCart = (id: number, name: string, price: number) => {
    const savedCart = localStorage.getItem('ecommerce-cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    
    const existingItem = cartItems.find((item: any) => item.id === id.toString())
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        id: id.toString(),
        name,
        price,
        quantity: 1
      })
    }
    
    localStorage.setItem('ecommerce-cart', JSON.stringify(cartItems))
    setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0))
    
    showNotification('Item added to cart!')
  }

  const showNotification = (message: string) => {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-weight: 500;
    `
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link href="/">Frostburg Clothing</Link>
          </div>
          <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link href="/" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/store" className="nav-link active" onClick={() => setIsNavOpen(false)}>Store</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link" onClick={() => setIsNavOpen(false)}>About</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link" onClick={() => setIsNavOpen(false)}>Contact</Link>
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-link" onClick={() => setIsNavOpen(false)}>Login</Link>
            </li>
            <li className="nav-item">
              <Link href="/checkout" className="nav-link cart-icon" onClick={() => setIsNavOpen(false)}>
                Cart <span id="cart-count">{cartCount}</span>
              </Link>
            </li>
          </ul>
          <div className={`hamburger ${isNavOpen ? 'active' : ''}`} onClick={() => setIsNavOpen(!isNavOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Store Header */}
      <section className="store-header">
        <div className="container">
          <h1>Our Collection</h1>
          <p>Premium outdoor clothing and gear for every adventure</p>
        </div>
      </section>

      {/* Store Filters */}
      <section className="store-filters">
        <div className="container">
          <div className="filter-container">
            <div className="search-box">
              <input 
                type="text" 
                id="search-input" 
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-options">
              <select 
                id="category-filter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
              <select 
                id="price-filter"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
              <select 
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="featured-products">
        <div className="container">
          <div className="products-grid" id="products-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Frostburg Clothing</h3>
              <p>Premium outdoor clothing and casual wear for the modern adventurer.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/store">Store</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/login">Login</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: support@frostburgclothing.com</p>
              <p>Phone: (301) 420-6969</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Frostburg Clothing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}