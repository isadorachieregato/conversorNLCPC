# Conversor NL ⇄ CPC

Este projeto é um agente de IA desenvolvido em **Next.js**, utilizando a API do **Gemini**, capaz de converter frases da **Linguagem Natural (NL)** para **Cálculo Proposicional Clássico (CPC)** e também converter no sentido inverso.

## 🏗️ Arquitetura do Sistema

A estrutura geral do projeto segue a organização abaixo:

```
src/
 ├─ app/
 │   ├─ api/generate/route.js       → Rota da API que conversa com o Gemini
 │   ├─ conversao/
 │   │    ├─ nlForCpc/page.js       → Tela: NL → CPC
 │   │    └─ cpcForNl/page.js       → Tela: CPC → NL
 │   ├─ layout.js
 │   └─ page.js                    → Página inicial
 │
 ├─ components/
 │   └─ GenkitInference.js         → Função utilitária de inferência
 │
 ├─ lib/
 │   └─ genkit.js                  → Configuração do cliente do Gemini
 │
.env                                    → Chave da API
```

### 📌 Fluxo de Funcionamento

1. O usuário digita uma frase (NL ou CPC) em uma das interfaces.
2. O front-end envia a requisição para `/api/generate`.
3. A rota chama a API do **Gemini 1.5 Flash** usando regras de tradução.
4. O Gemini retorna a conversão sugerida.
5. O front-end exibe o resultado na tela.

## 🔤 Estratégia de Tradução

A conversão foi construída com base em duas camadas:

### **1) Regras e mapeamentos determinísticos**

* Identificação de condicionais
* Identificação de loops
* Ações comuns como *imprimir*, *ler*, *somar*, *atribuir*

### Exemplos de NL → CPC

| Entrada (NL)                            | Saída (CPC)                              |
| --------------------------------------- | ---------------------------------------- |
| **"se chover eu não irei na academia"** | `se (chover) então não vá_para_academia` |
| **"calcule a soma de A e B"**           | `soma = A + B`                           |
| **"repita 5 vezes a frase olá"**        | `para i de 1 até 5 faça imprimir("olá")` |

### Exemplos de CPC → NL

| Entrada (CPC)                        | Saída (NL)                                        |
| ------------------------------------ | ------------------------------------------------- |
| `se x > 10 então imprimir("alto")`   | "Se X for maior que 10, escreva 'alto'."          |
| `para i de 1 até 3 faça imprimir(i)` | "Repita de 1 a 3 imprimindo o valor de i."        |
| `total = preco * quantidade`         | "O total é o preço multiplicado pela quantidade." |

## 🤖 Papel do LLM (Gemini)

O modelo entra quando:

* A frase é ambígua.
* A estrutura é mais avançada.
* O usuário escreve frases incompletas.

Exemplo analisado:

Entrada: **"se chover eu nao irei na academia"**

O LLM identifica:

* Condicional
* Consequência atômica (não ir)
* Verbo implícito → "ir para academia"

Resultado mais coerente:

```
se (chover) então
    nao_ir_para_academia
fim_se
```

Acerto: Identifica corretamente premissa e ação.
Erro possível: Verbos podem ser interpretados com nomes diferentes.

## ⚠️ Limitações Atuais

1. **Ambiguidade linguística**
   NL pode ter múltiplas interpretações.

2. **Falta de contexto**
   O sistema traduz frase a frase; não entende um programa completo.

3. **Erros do LLM**
   O modelo pode inventar ações ou formatos não desejados.

4. **Falta de validação sintática**
   O CPC retornado não é validado por um compilador/ferramenta externa.

## 🚀 Possibilidades de Melhoria

* Regras fixas mais robustas (regex + AST simplificado)
* Normalização semântica (dicionário NL ↔ CPC)
* Modo "programa completo"
* Adicionar explicações passo a passo da tradução
* Login

## 🎥 Vídeo Demonstrativo
