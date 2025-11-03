'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '../lib/products'

interface ProductCardProps {
  product: Product
  onAddToCart: (id: number, name: string, price: number) => void
  showAddToCart?: boolean
}

export default function ProductCard({ product, onAddToCart, showAddToCart = true }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    onAddToCart(product.id, product.name, product.price)
  }

  const getProductLinkText = () => {
    return `View ${product.name} Details`
  }

  const getAddToCartText = () => {
    return `Add ${product.name} to Cart`
  }

  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`} className="product-link" aria-label={getProductLinkText()}>
        <div className="product-image">
          <Image 
            src={product.image} 
            alt={product.name}
            width={300}
            height={300}
            style={{ objectFit: 'cover', width: '100%', height: '200px' }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description-preview">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
        </div>
      </Link>
      {showAddToCart && (
        <button 
          className="btn btn-outline add-to-cart" 
          onClick={handleAddToCart}
          aria-label={getAddToCartText()}
        >
          Add to Cart
        </button>
      )}
    </div>
  )
}
