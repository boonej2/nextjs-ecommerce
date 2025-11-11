import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/cart
 * Get user's cart items
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform to match CartItem interface
    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size || undefined,
      color: item.color || undefined,
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity = 1, size, color } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if item already exists in cart (handle nullable size/color)
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: parseInt(productId),
        size: size || null,
        color: color || null,
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      })

      return NextResponse.json({
        item: {
          id: updatedItem.id,
          productId: updatedItem.productId,
          name: updatedItem.product.name,
          price: updatedItem.product.price,
          quantity: updatedItem.quantity,
          size: updatedItem.size || undefined,
          color: updatedItem.color || undefined,
        },
      })
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: parseInt(productId),
          quantity,
          size: size || null,
          color: color || null,
        },
        include: {
          product: true,
        },
      })

      return NextResponse.json({
        item: {
          id: newItem.id,
          productId: newItem.productId,
          name: newItem.product.name,
          price: newItem.product.price,
          quantity: newItem.quantity,
          size: newItem.size || undefined,
          color: newItem.color || undefined,
        },
      })
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/cart
 * Update cart item quantity
 */
export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      )
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId },
      })
      return NextResponse.json({ success: true, deleted: true })
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    })

    return NextResponse.json({
      item: {
        id: updatedItem.id,
        productId: updatedItem.productId,
        name: updatedItem.product.name,
        price: updatedItem.product.price,
        quantity: updatedItem.quantity,
        size: updatedItem.size || undefined,
        color: updatedItem.color || undefined,
      },
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart
 * Remove item from cart or clear entire cart
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { itemId, clearAll } = body

    if (clearAll) {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })
      return NextResponse.json({ success: true })
    }

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Verify the cart item belongs to the user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting from cart:', error)
    return NextResponse.json(
      { error: 'Failed to delete from cart' },
      { status: 500 }
    )
  }
}

