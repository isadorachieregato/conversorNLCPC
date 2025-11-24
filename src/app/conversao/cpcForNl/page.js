'use client'
import Link from 'next/link';
import GenKitInference from '../../../components/GenkitInference'; 

export default function CpcForNlPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0e0e0e',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Link href="/" style={{ marginBottom: '40px', alignSelf: 'flex-start', marginLeft: '20px', textDecoration: 'none', color: '#ffbb44' }}>
        ← Voltar
      </Link>
      
      <h1 className="text-white" style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: 'bold' }}>
        CPC → Linguagem Natural
      </h1>
      <p className="text-gray-300" style={{ maxWidth: '600px', opacity: 0.8, marginBottom: '40px', textAlign: 'center' }}>
        Insira a fórmula CPC e defina o dicionário de proposições para obter a tradução.
      </p>

      <GenKitInference 
        labelInput="Fórmula CPC"
        labelOutput="Tradução em Português"
        placeholder={`Exemplo:\n(P \u2194 Q) \u2227 \u00ACR`}
        buttonText="Converter para Linguagem Natural"
        mode="cpc-to-nl"
      />
    </div>
  );
}