'use client'

/**
 * Client-side cart utilities following DRY principles
 * Handles both localStorage (for guests) and database (for logged-in users)
 */

import { checkAuthStatus } from './auth-client'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  productId?: number
}

/**
 * Get cart items - uses database for logged-in users, localStorage for guests
 */
export async function getCartItems(): Promise<CartItem[]> {
  const { authenticated } = await checkAuthStatus()
  
  if (authenticated) {
    // Fetch from database
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.items || []
      }
    } catch (error) {
      console.error('Error fetching cart from database:', error)
    }
  }
  
  // Fallback to localStorage for guests or on error
  const savedCart = localStorage.getItem('ecommerce-cart')
  return savedCart ? JSON.parse(savedCart) : []
}

/**
 * Add item to cart - uses database for logged-in users, localStorage for guests
 */
export async function addToCart(
  productId: number,
  name: string,
  price: number,
  quantity: number = 1,
  size?: string,
  color?: string
): Promise<boolean> {
  const { authenticated } = await checkAuthStatus()
  
  if (authenticated) {
    // Add to database
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          quantity,
          size,
          color,
        }),
      })
      
      if (response.ok) {
        window.dispatchEvent(new Event('cartUpdated'))
        return true
      }
    } catch (error) {
      console.error('Error adding to cart in database:', error)
    }
  }
  
  // Fallback to localStorage for guests or on error
  const savedCart = localStorage.getItem('ecommerce-cart')
  let cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : []
  
  const itemKey = `${productId}-${size || ''}-${color || ''}`
  const existingItem = cartItems.find(
    (item) => item.id === itemKey || (item.productId === productId && item.size === size && item.color === color)
  )
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.push({
      id: itemKey,
      productId,
      name,
      price,
      quantity,
      size,
      color,
    })
  }
  
  localStorage.setItem('ecommerce-cart', JSON.stringify(cartItems))
  window.dispatchEvent(new Event('cartUpdated'))
  return true
}

/**
 * Update cart item quantity - uses database for logged-in users, localStorage for guests
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<boolean> {
  const { authenticated } = await checkAuthStatus()
  
  if (authenticated) {
    // Update in database
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          itemId,
          quantity,
        }),
      })
      
      if (response.ok) {
        window.dispatchEvent(new Event('cartUpdated'))
        return true
      }
    } catch (error) {
      console.error('Error updating cart item in database:', error)
    }
  }
  
  // Fallback to localStorage for guests or on error
  const savedCart = localStorage.getItem('ecommerce-cart')
  if (!savedCart) return false
  
  let cartItems: CartItem[] = JSON.parse(savedCart)
  cartItems = cartItems.map((item) =>
    item.id === itemId ? { ...item, quantity } : item
  ).filter((item) => item.quantity > 0)
  
  localStorage.setItem('ecommerce-cart', JSON.stringify(cartItems))
  window.dispatchEvent(new Event('cartUpdated'))
  return true
}

/**
 * Remove item from cart - uses database for logged-in users, localStorage for guests
 */
export async function removeCartItem(itemId: string): Promise<boolean> {
  const { authenticated } = await checkAuthStatus()
  
  if (authenticated) {
    // Remove from database
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemId }),
      })
      
      if (response.ok) {
        window.dispatchEvent(new Event('cartUpdated'))
        return true
      }
    } catch (error) {
      console.error('Error removing cart item from database:', error)
    }
  }
  
  // Fallback to localStorage for guests or on error
  const savedCart = localStorage.getItem('ecommerce-cart')
  if (!savedCart) return false
  
  let cartItems: CartItem[] = JSON.parse(savedCart)
  cartItems = cartItems.filter((item) => item.id !== itemId)
  
  localStorage.setItem('ecommerce-cart', JSON.stringify(cartItems))
  window.dispatchEvent(new Event('cartUpdated'))
  return true
}

/**
 * Clear cart - uses database for logged-in users, localStorage for guests
 */
export async function clearCart(): Promise<boolean> {
  const { authenticated } = await checkAuthStatus()
  
  if (authenticated) {
    // Clear database cart
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ clearAll: true }),
      })
      
      if (response.ok) {
        window.dispatchEvent(new Event('cartUpdated'))
        return true
      }
    } catch (error) {
      console.error('Error clearing cart in database:', error)
    }
  }
  
  // Fallback to localStorage for guests or on error
  localStorage.removeItem('ecommerce-cart')
  window.dispatchEvent(new Event('cartUpdated'))
  return true
}

/**
 * Get cart count - uses database for logged-in users, localStorage for guests
 */
export async function getCartCount(): Promise<number> {
  const items = await getCartItems()
  return items.reduce((total, item) => total + item.quantity, 0)
}

