'use server'

import { signIn } from "@/lib/auth"

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    // Debug: Log what we get back (remove in production)
    console.log('signIn result:', result, 'type:', typeof result)

    // NextAuth v5: signIn can return:
    // - undefined on success with redirect: false
    // - a string (URL) on success (if redirect is enabled)
    // - an object with error/ok properties
    if (!result) {
      // No result means success (common in NextAuth v5)
      return { success: true }
    }

    // If result is a string (URL), it means success
    if (typeof result === 'string') {
      return { success: true }
    }

    // If result is an object, check for error
    if (typeof result === 'object') {
      if (result?.error) {
        return { error: result.error }
      }

      // If result exists and has ok property, check it
      if ('ok' in result) {
        if (result.ok) {
          return { success: true }
        }
        return { error: 'Authentication failed' }
      }

      // If result exists without error, consider it success
      return { success: true }
    }

    // Fallback: if we get here, something unexpected happened
    console.warn('Unexpected signIn result type:', typeof result, result)
    return { success: true } // Default to success if we can't determine
  } catch (error: any) {
    // In NextAuth v5, signIn might throw on success (for redirects)
    // Check if it's a redirect error which actually means success
    if (error?.cause?.err?.message?.includes('NEXT_REDIRECT')) {
      return { success: true }
    }
    
    console.error('Sign in error:', error)
    return { error: error?.message || 'An error occurred during sign in' }
  }
}

