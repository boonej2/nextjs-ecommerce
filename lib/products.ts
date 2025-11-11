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

/**
 * Fetch all products from the database
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products', {
      cache: 'no-store', // Always fetch fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

/**
 * Fetch product by ID from the database
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      cache: 'no-store', // Always fetch fresh data
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch product')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

/**
 * Fetch products by category from the database
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const allProducts = await getAllProducts()
  return allProducts.filter(product => product.category === category)
}

/**
 * Fetch featured products from the database
 */
export async function getFeaturedProducts(count: number = 3): Promise<Product[]> {
  const allProducts = await getAllProducts()
  return allProducts.slice(0, count)
}
