# Precifique

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Calculadora de Precificação para Marketplaces**

*Descubra o preço ideal para vender na Shopee e Mercado Livre*

[Demo](https://johnpitter.github.io/precifique/) •
[Features](#features) •
[Screenshots](#screenshots) •
[Comissões](#comissões) •
[Desenvolvimento](#desenvolvimento)

</div>

---

## Overview

Precifique calcula o preço ideal de venda para os maiores marketplaces do Brasil, considerando custos do produto, margem de lucro desejada, impostos e comissões atualizadas.

**O que você pode fazer:**
- **Preço Ideal** — Calcular o preço de venda com base nos custos e margem desejada
- **Cálculo Reverso** — Já sabe o preço? Veja quanto sobra de lucro em cada marketplace
- **Comparativo** — Visualizar lado a lado qual marketplace dá mais lucro
- **Subsídio Pix** — Ver economia com pagamento via Pix (Shopee)

---

## Features

| Feature | Descrição |
|---------|-----------|
| **Preço Ideal** | Calcula o preço de venda ideal por marketplace |
| **Cálculo Reverso** | Dado um preço, mostra lucro real e margem |
| **Comparativo Rápido** | Ranking visual de lucratividade entre marketplaces |
| **Subsídio Pix** | Economia com Pix na Shopee (5-8% de desconto) |
| **Impostos** | Simples Nacional integrado ao cálculo (0-30%) |
| **4 Marketplaces** | Shopee CNPJ, Shopee CPF, ML Clássico, ML Premium |
| **Responsivo** | Mobile-first, funciona em qualquer dispositivo |

---

## Screenshots

![Precifique](assets/screenshot.png)

---

## Comissões

Dados atualizados em **Março/2026**. Consulte os sites oficiais para verificar valores vigentes.

### Shopee (CNPJ e CPF)

| Faixa de Preço | Comissão | Taxa Fixa | Subsídio Pix |
|----------------|----------|-----------|--------------|
| ≤ R$79,99 | 20% | R$4 | — |
| ≤ R$99,99 | 14% | R$16 | 5% |
| ≤ R$199,99 | 14% | R$20 | 5% |
| ≤ R$499,99 | 14% | R$26 | 5% |
| > R$499,99 | 14% | R$28 | 8% |

### Mercado Livre — Clássico

| Faixa de Preço | Comissão | Taxa Fixa |
|----------------|----------|-----------|
| ≤ R$79 | 14% | R$6,50 |
| ≤ R$199 | 13% | — |
| > R$199 | 10% | — |

### Mercado Livre — Premium

| Faixa de Preço | Comissão | Taxa Fixa |
|----------------|----------|-----------|
| ≤ R$79 | 19% | — |
| ≤ R$199 | 18% | — |
| > R$199 | 15% | — |

> **Fontes oficiais:**
> [Shopee](https://seller.shopee.com.br/edu/article/26839) •
> [Mercado Livre](https://www.mercadolivre.com.br/ajuda/quanto-custa-vender-um-produto_1338)

---

## Como Funciona

### Cálculo do Preço Ideal

```
custo_total = custo_produto + embalagem + mão_de_obra + frete + outros
imposto = custo_total × taxa_imposto
preço_venda = (custo_total + imposto + taxa_fixa) / (1 - margem - comissão%)
```

O algoritmo itera até convergir no preço ideal, já que a faixa de comissão depende do preço final.

### Cálculo Reverso

```
taxas = preço_venda × comissão% + taxa_fixa
receita_líquida = preço_venda - taxas
lucro = receita_líquida - custo_total
margem_real = lucro / preço_venda × 100
```

---

## Desenvolvimento

### Requisitos

| Requisito | Versão |
|-----------|--------|
| Node.js | 20+ |
| npm | 10+ |

### Setup

```bash
git clone https://github.com/JohnPitter/precifique.git
cd precifique
npm install
npm run dev
```

Acesse `http://localhost:5173`

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build |
| `npm run test` | Rodar testes |
| `npm run lint` | Linting com ESLint |

### Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.2 | UI framework |
| Vite | 7.3 | Build tool |
| Tailwind CSS | 4.2 | Estilização |
| Vitest | 4.0 | Testes |

### Estrutura

```
src/
├── lib/
│   ├── pricing.js          # Motor de cálculo (preço ideal + reverso)
│   ├── pricing.test.js     # Testes do motor de cálculo
│   ├── marketplaces.js     # Tabelas de comissão por marketplace
│   └── marketplaces.test.js
├── components/
│   ├── App.jsx             # Container principal + state
│   ├── CostForm.jsx        # Formulário de custos
│   ├── MarketplaceCard.jsx # Card de resultado por marketplace
│   ├── ComparisonBar.jsx   # Gráfico comparativo
│   ├── ReverseCalc.jsx     # Cálculo reverso
│   ├── Header.jsx
│   └── Footer.jsx
├── index.css               # Tema Tailwind
└── main.jsx
```

---

## Deploy

Deploy automático via GitHub Pages em cada push para `main`.

**URL:** [johnpitter.github.io/precifique](https://johnpitter.github.io/precifique/)

---

## License

MIT

---

## Suporte

- **Issues:** [GitHub Issues](https://github.com/JohnPitter/precifique/issues)
