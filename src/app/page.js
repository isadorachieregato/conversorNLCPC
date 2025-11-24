'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0e0e0e',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: 'bold' }}>
        Conversor NL ⇄ CPC
      </h1>

      <p style={{ maxWidth: '600px', fontSize: '1.1rem', opacity: 0.8, marginBottom: '40px' }}>
        Escolha o tipo de conversão que deseja realizar.
      </p>

      {/* Container dos botões */}
      <div
        style={{
          display: 'flex',
          gap: '30px',
        }}
      >
        {/* Botão Esquerdo (Roxo) */}
        <Link href="/conversao/nlForCpc" >
          <button
            type="button"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            style={{
              background: 'linear-gradient(135deg, #6a0dad, #9b4dff)',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'white',
              transition: 'transform 0.15s ease',
            }}
          >
            Linguagem Natural → CPC
          </button>
        </Link>

        {/* Botão Direito (Laranja) */}
        <Link href="/conversao/cpcForNl">
          <button
            type="button"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            style={{
              background: 'linear-gradient(135deg, #ff7a00, #ffbb44)',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'white',
              transition: 'transform 0.15s ease',
            }}
          >
            CPC → Linguagem Natural
          </button>
        </Link>
      </div>
    </div>
  )
}
