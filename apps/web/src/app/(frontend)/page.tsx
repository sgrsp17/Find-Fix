import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Find&amp;Fix</h1>
      <p>API e backoffice. O website corporativo entra no Sprint 2.</p>
      <p>
        <Link href="/admin">Backoffice</Link>
      </p>
    </main>
  )
}
