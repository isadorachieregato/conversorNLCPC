'use client'
import Link from 'next/link';
import GenKitInference from "@/components/GenkitInference"

export default function NLForCPCPage() {
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
       Linguagem Natural →  CPC
      </h1>
      <p className="text-gray-300" style={{ maxWidth: '600px', opacity: 0.8, marginBottom: '40px', textAlign: 'center' }}>
        Insira o texto e confirme para obter a tradução.
      </p>
      <GenKitInference
        labelInput="Frase em Linguagem Natural"
        labelOutput="Fórmula em Cálculo Proposicional"
        placeholder="Ex: Se chover então levarei guarda-chuva..."
        buttonText="Converter para CPC"
        mode="nl-to-cpc"
      />
    </div>
  )
}
