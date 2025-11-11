'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '../../components/ProductCard'
import Navigation from '../../components/Navigation'
import { Product, getAllProducts } from '../../lib/products'
import { addToCart } from '../../lib/cart-client'

export default function Store() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const allProducts = await getAllProducts()
      setProducts(allProducts)
      setFilteredProducts(allProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleAddToCart = async (id: number, name: string, price: number) => {
    await addToCart(id, name, price, 1)
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
      <Navigation />

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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="products-grid" id="products-grid">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
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