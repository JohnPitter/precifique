# Margem

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-1f2937?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-0f766e?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-0f172a?style=for-the-badge)

**Cockpit de precificacao para marketplaces**

*Projeto originalmente lancado como Precifique. O rebranding mantem o repo e a URL atuais por enquanto.*

[Demo](https://johnpitter.github.io/precifique/) •
[Visao Geral](#visao-geral) •
[Features](#features) •
[Como-Funciona](#como-funciona) •
[Desenvolvimento](#desenvolvimento)

</div>

---

## Visao Geral

Margem ajuda vendedores brasileiros a decidir preco com menos chute e mais contexto operacional. A aplicacao cruza custo unitario, imposto, comissoes e taxa fixa para responder tres perguntas centrais:

- Qual preco protege a margem minima desejada?
- Qual marketplace deixa mais lucro por unidade?
- Se eu vender pelo preco que ja pratico, quanto realmente sobra?

O app compara Shopee CNPJ, Shopee CPF, Mercado Livre Classico e Mercado Livre Premium com leitura de preco ideal e simulacao reversa.

---

## Features

| Feature | Descricao |
|---------|-----------|
| **Rebranding completo** | Nova identidade visual, narrativa mais analitica e interface em formato de cockpit |
| **Preco ideal** | Calcula o preco necessario para sustentar a margem-alvo por marketplace |
| **Simulador reverso** | Informa taxas, repasse liquido, lucro e margem real a partir de um preco ja definido |
| **Ranking de canais** | Ordena os marketplaces pelo lucro por unidade e destaca o melhor encaixe |
| **Leitura de Pix** | Mostra o impacto do subsidio Pix na Shopee |
| **Custos detalhados** | Produto, embalagem, mao de obra, frete, outros custos e imposto |
| **Responsivo** | Experiencia revisada para desktop e mobile |

---

## Screenshot

![Margem](assets/screenshot.png)

---

## Como Funciona

### 1. Calculo do preco ideal

```text
custo_total = custo_produto + embalagem + mao_de_obra + frete + outros
imposto = custo_total × taxa_imposto
preco_venda = (custo_total + imposto + taxa_fixa) / (1 - margem - comissao)
```

Como comissao e taxa fixa dependem da faixa de preco, o motor itera ate convergir no valor final.

### 2. Calculo reverso

```text
taxas = preco_venda × comissao + taxa_fixa
receita_liquida = preco_venda - taxas
lucro = receita_liquida - custo_total
margem_real = lucro / preco_venda × 100
```

### 3. Marketplaces cobertos

| Canal | Regra principal |
|------|------------------|
| **Shopee CNPJ** | Faixas com comissao de 14% a 20% + taxa fixa + subsidio Pix |
| **Shopee CPF** | Mesmo modelo da Shopee com acrescimo operacional de R$3 na taxa fixa |
| **ML Classico** | Comissao de 10% a 14% com taxa fixa apenas nas faixas mais baixas |
| **ML Premium** | Comissao de 15% a 19% sem taxa fixa |

> Referencia interna de dados: Marco/2026. Sempre confirme mudancas nos portais oficiais.

---

## Desenvolvimento

### Requisitos

| Requisito | Versao |
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

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para producao |
| `npm run preview` | Preview do build |
| `npm run test` | Testes com Vitest |
| `npm run lint` | Linting com ESLint |

### Stack

| Tecnologia | Uso |
|------------|-----|
| React 19 | Interface e estado |
| Vite 7 | Build e dev server |
| Tailwind CSS 4 | Tema e composicao visual |
| Vitest 4 | Validacao do motor de precificacao |

### Estrutura

```text
src/
├── App.jsx
├── index.css
├── components/
│   ├── ComparisonBar.jsx
│   ├── CostForm.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── MarketplaceCard.jsx
│   └── ReverseCalc.jsx
└── lib/
    ├── marketplaces.js
    ├── marketplaces.test.js
    ├── pricing.js
    └── pricing.test.js
```

---

## Deploy

Deploy automatico via GitHub Pages a cada push em `main`.

**URL atual:** [johnpitter.github.io/precifique](https://johnpitter.github.io/precifique/)

---

## Fontes oficiais

- Shopee: https://seller.shopee.com.br/edu/article/26839
- Mercado Livre: https://www.mercadolivre.com.br/ajuda/quanto-custa-vender-um-produto_1338

---

## License

MIT
