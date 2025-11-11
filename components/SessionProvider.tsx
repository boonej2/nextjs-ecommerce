'use client'

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // NextAuth v5 doesn't require a SessionProvider wrapper
  // The session is handled server-side via the auth() function
  return <>{children}</>
}
