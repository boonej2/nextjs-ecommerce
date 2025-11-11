'use client'

/**
 * Client-side utility functions for authentication
 */

export async function checkAuthStatus(): Promise<{ authenticated: boolean; user?: { id: string; email: string; name?: string | null } }> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data?.user) {
        return { authenticated: true, user: data.user }
      }
    }
    return { authenticated: false }
  } catch (error) {
    console.error('Error checking auth status:', error)
    return { authenticated: false }
  }
}

export async function signOutUser(): Promise<boolean> {
  try {
    // NextAuth v5 uses /api/auth/signout endpoint
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    
    if (response.ok) {
      // Clear any client-side state
      return true
    }
    return false
  } catch (error) {
    console.error('Error signing out:', error)
    return false
  }
}

