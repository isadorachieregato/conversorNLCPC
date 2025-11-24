'use client'
import Link from 'next/link';
// O caminho foi alterado de '@/components/GenKitInference' para ser relativo,
// garantindo que ele funcione independentemente da configuração do alias @/.
import GenKitInference from '../../../components/GenKitInference'; 

export default function NlForCpcPage() {
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
      <Link href="/" style={{ marginBottom: '40px', alignSelf: 'flex-start', marginLeft: '20px', textDecoration: 'none', color: '#9b4dff' }}>
        ← Voltar
      </Link>
      
      <h1 className="text-white" style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: 'bold' }}>
        Linguagem Natural → CPC
      </h1>
      <p className="text-gray-300" style={{ maxWidth: '600px', opacity: 0.8, marginBottom: '40px', textAlign: 'center' }}>
        Insira uma frase em linguagem natural para convertê-la em Cálculo Proposicional Clássico (CPC).
      </p>

      {/* O componente GenKitInference agora faz todo o trabalho */}
      <GenKitInference 
        labelInput="Frase em Linguagem Natural"
        labelOutput="Fórmula CPC"
        placeholder="Exemplo: Se eu estudar muito, então passarei na matéria, e vice-versa."
        buttonText="Converter para CPC"
        mode="nl-to-cpc"
      />
    </div>
  );
}