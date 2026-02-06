import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {session.user.image && (
          <img 
            src={session.user.image} 
            alt="Profile" 
            style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
          />
        )}
        <span>{session.user.email}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn("google")}>Sign in with Google</button>
  )
}