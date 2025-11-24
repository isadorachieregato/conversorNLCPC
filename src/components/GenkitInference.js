'use client'
import { useRef, useState } from 'react'

const MODEL_NAME = 'gemini-2.5-flash-preview-09-2025' 

/**

 * @param {object} payload 
 * @param {number} timeoutMs
 * @returns {Promise<string>} 
 */
async function callGenKitAPI(payload, timeoutMs = 15000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    let data = null

    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      try {
        data = JSON.parse(text)
      } catch {
        if (response.ok) return text
        throw new Error(`Erro ${response.status}: ${text}`)
      }
    }

    if (!response.ok) {
      const msg = (data && (data.error || data.message)) ?? `Erro ${response.status}`
      throw new Error(msg)
    }

    const text =
      data?.text ??
      data?.resposta ?? 
      (data?.choices && data.choices[0]?.text) ??
      (typeof data === 'string' ? data : undefined)

    if (!text) {
      return JSON.stringify(data)
    }

    return text
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('A requisição expirou (timeout). Tente novamente.')
    throw err
  } finally {
    clearTimeout(id)
  }
}

/**
 * @param {object} props
 * @param {string} props.labelInput 
 * @param {string} props.labelOutput 
 * @param {string} props.placeholder 
 * @param {string} props.buttonText 
 * @param {'nl-to-cpc' | 'cpc-to-nl'} props.mode 
 */
export default function GenKitInference({
  labelInput,
  labelOutput,
  placeholder,
  buttonText = 'Converter',
  mode,
}) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [propositions, setPropositions] = useState({})
  const [showProps, setShowProps] = useState(false)
  const textareaRef = useRef(null)

  const cpcSymbols = [
    { k: '¬', v: '¬', title: 'Negação' },
    { k: '∧', v: ' ∧ ', title: 'Conjunção' },
    { k: '∨', v: ' ∨ ', title: 'Disjunção' },
    { k: '→', v: ' → ', title: 'Implicação' },
    { k: '↔', v: ' ↔ ', title: 'Bicondicional' },
    { k: '(', v: '(', title: 'Abre parêntese' },
    { k: ')', v: ')', title: 'Fecha parêntese' },
  ]

  const isCpcToNl = mode === 'cpc-to-nl'
  const accentColorNL = '#6a0dad' 
  const buttonBackgroundNL = 'linear-gradient(135deg, #6a0dad, #9b4dff)'
  const resultBorderColorNL = '#9b4dff'
  const accentColorCPC = '#ff7a00' 
  const buttonBackgroundCPC = 'linear-gradient(135deg, #ff7a00, #ffbb44)'
  const resultBorderColorCPC = '#ffbb44'

  const accentColor = isCpcToNl ? accentColorCPC : accentColorNL
  const buttonBackground = isCpcToNl ? buttonBackgroundCPC : buttonBackgroundNL
  const resultBorderColor = isCpcToNl ? resultBorderColorCPC : resultBorderColorNL
  
  const labelTextProps = {
    className: "block text-lg font-semibold mb-1",
    style: { color: isCpcToNl ? accentColorCPC : 'inherit' } 
  }
  
  const subLabelTextProps = {
    className: "block text-sm mb-2 font-medium text-gray-300",
    style: { color: isCpcToNl ? resultBorderColorCPC : 'inherit' } 
  }

  const insertAtCursor = (text) => {
    const el = textareaRef.current
    if (!el) {
      setInput(prev => prev + text)
      return
    }
    const start = el.selectionStart ?? input.length
    const end = el.selectionEnd ?? input.length
    const before = input.slice(0, start)
    const after = input.slice(end)
    const next = before + text + after
    setInput(next)

    requestAnimationFrame(() => {
      const pos = start + text.length
      el.focus()
      try { el.setSelectionRange(pos, pos) } catch {}
    })
  }

  const handleConvert = async (e) => {
    e.preventDefault()

    if (!input.trim()) {
      setError(isCpcToNl ? 'Por favor, insira a fórmula CPC.' : 'Por favor, insira uma frase para conversão.')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')
    setShowProps(false)
    if (mode === 'nl-to-cpc') setPropositions({})


    try {
      let payload
      if (mode === 'nl-to-cpc') {
        payload = { mode: 'nl-to-cpc', input: input.trim() }
      } else {
        const filteredPropositions = Object.fromEntries(
          Object.entries(propositions).filter(([, v]) => v.trim() !== '')
        )
        payload = { mode: 'cpc-to-nl', input: input.trim(), propositions: filteredPropositions }
      }

      const result = await callGenKitAPI(payload)
      let cleanOutput = result
      let extractedPropositions = {}
      
      try {
        const json = JSON.parse(result)
        if (json.formula) cleanOutput = json.formula
        else if (json.sentence) cleanOutput = json.sentence
        
        if (mode === 'nl-to-cpc' && json.propositions && typeof json.propositions === 'object') {
             extractedPropositions = json.propositions
        }
      } catch {}

      if (mode === 'nl-to-cpc' && /F[óo]rmula:/i.test(result)) {
        const formulaMatch = result.match(/F[óo]rmula:\s*([\s\S]+?)(?:\n|$)/i)
        if (formulaMatch) {
          cleanOutput = formulaMatch[1].trim()
        }
      }

      if (mode === 'nl-to-cpc' && /Proposi[cç][õo]es:/i.test(result)) {
        const propsBlockMatch = result.match(/Proposi[cç][õo]es:\s*([\s\S]*)/i)
        if (propsBlockMatch) {
          const block = propsBlockMatch[1]
          const lines = block.split('\n').map(l => l.trim()).filter(l => l)
          
          lines.forEach(l => {
            const mm = l.match(/^([A-Z])\s*:\s*(.+)$/)
            if (mm) extractedPropositions[mm[1]] = mm[2]
          })
        }
      }

      if (mode === 'cpc-to-nl') {
          cleanOutput = cleanOutput.replace(/Resposta:|Tradução em Português:|Tradução:|Frase:|Formula:/i, '').trim();
      }

      if (Object.keys(extractedPropositions).length > 0) {
        setPropositions(extractedPropositions)
        setShowProps(true)
      } else {
        setShowProps(false)
      }
      
      setOutput(cleanOutput)
      
    } catch (err) {
      setError(err.message || 'Erro ao processar a requisição.')
      console.error("Conversion error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-white p-4">
      <form onSubmit={handleConvert} className="w-full space-y-4">
        
        <label {...labelTextProps}>{labelInput}</label>
        
        {isCpcToNl && (
          <div className="flex flex-wrap gap-2 mb-2 p-3 rounded-xl border border-gray-700 bg-[#1a1a1a]">
            <span className="text-sm mr-1 text-gray-400">Inserir conectivos:</span>
            {cpcSymbols.map(btn => (
              <button
                key={btn.k}
                type="button"
                title={btn.title}
                onClick={() => insertAtCursor(btn.v)}
                className="px-2 py-1 text-sm border rounded-md hover:bg-gray-700 transition"
                style={{ color: resultBorderColor, borderColor: resultBorderColor }}
              >
                {btn.k}
              </button>
            ))}
          </div>
        )}

        <textarea
          className="w-full rounded-xl p-4 bg-[#1a1a1a] text-white focus:ring-2 focus:ring-offset-2"
          style={{ border: `2px solid ${accentColor}`, resize: 'vertical' }}
          rows={4}
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          ref={textareaRef}
          required
        />

        {isCpcToNl && (
          <div className="mt-2 p-4 bg-[#1a1a1a] rounded-xl border border-gray-700">
            <label {...subLabelTextProps}>Definição das Proposições Atômicas (Dicionário)</label>
            <div className="flex flex-wrap gap-3">
              {[...'PQRSTUV'].map(atom => (
                <div key={atom} className="flex flex-col">
                    <span className="text-xs font-bold mb-1" style={{ color: resultBorderColor }}>{atom}:</span>
                    <input
                      type="text"
                      className="border rounded-md px-2 py-1 text-sm bg-gray-800 text-white focus:outline-none focus:ring-1"
                      placeholder={`Proposição ${atom}`}
                      value={propositions[atom] || ''}
                      onChange={e =>
                        setPropositions(p => ({ ...p, [atom]: e.target.value }))
                      }
                      style={{ width: 120, borderColor: accentColor }}
                    />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold transition hover:scale-[1.01] duration-150"
          style={{ 
            background: buttonBackground, 
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Convertendo...' : buttonText}
        </button>
      </form>

      {showProps && !isCpcToNl && Object.keys(propositions).length > 0 && (
        <div className="mt-8 w-full border rounded-xl p-4 bg-[#1a1a1a]" style={{ borderColor: resultBorderColor }}>
          <div className="font-semibold mb-2" style={{ color: resultBorderColor }}>Dicionário de Proposições:</div>
          <ul className="text-sm space-y-1 text-gray-200">
            {Object.entries(propositions).map(([k, v]) => (
              <li key={k}>
                <b className='text-gray-300'>{k}</b>: {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      {output && output.trim() !== '' && output.trim() !== 'null' && output.trim() !== 'undefined' && (
        <div className="mt-8 w-full border rounded-xl p-6 bg-[#1a1a1a]" style={{ borderColor: resultBorderColor }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: resultBorderColor }}>{labelOutput}</h2>
          <div className="text-lg whitespace-pre-wrap text-gray-200">{output}</div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-xl w-full">
          <p className="text-red-300 font-semibold">Erro:</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}