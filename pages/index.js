import AuthButton from '../components/AuthButton'

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>CPE Dashboard</h1>
      <p>Welcome! Please sign in to continue.</p>
      <AuthButton />
    </div>
  )
}