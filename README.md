# 🛡️ Web3 Risk Monitor - Agência IA Diniz

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Environment-Production-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Web3-Integrated-orange?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Ethers.js-3C3C3D?style=flat-square&logo=ethereum&logoColor=white" />
</p>

---

### 🇧🇷 Português
Plataforma full-stack de segurança que utiliza IA para auditorias rápidas em Smart Contracts e endereços. O sistema identifica vulnerabilidades críticas e riscos de centralização de forma automatizada.

### 🇺🇸 English
Full-stack security platform leveraging AI for rapid audits of Smart Contracts and wallet addresses. The system automatically identifies critical vulnerabilities and centralization risks.

---

## 📺 Preview
*(Adicione seus prints aqui / Add your screenshots here)*
> **Note:** Screenshots showing the EOA validation and USDT analysis are available in the project documentation.

---

## ⚙️ Como Funciona / How it Works

1.  **Connection:** User connects their wallet via MetaMask.
2.  **Input:** User provides a Smart Contract address.
3.  **Data Fetching:** Backend retrieves real-time blockchain data via Ethers.js.
4.  **AI Analysis:** Custom AI Engine evaluates patterns for proxies and centralization.
5.  **Report:** System generates a 0-100 risk score and a detailed report.

---

## 🏗️ Arquitetura / System Flow

```mermaid
graph LR
  A[User/MetaMask] --> B[Frontend Next.js]
  B --> C[Backend Node.js/TS]
  C --> D[Blockchain RPC / Ethers]
  C --> E[AI Analysis Engine]
  E --> F[Supabase DB]
  F --> B
🚀 Como Rodar / Getting Started

# Clone o repositório / Clone the repo
git clone [https://github.com/dinizdaniel284/web3-risk-monitor.git](https://github.com/dinizdaniel284/web3-risk-monitor.git)

# Instale as dependências / Install dependencies
npm install

# Inicie o modo de desenvolvimento / Run dev mode
npm run dev

🚀 Roadmap & Future Features
[ ] Smart Contract Bytecode Analysis: Deep scanning of unverified contracts.
[ ] Public API: Endpoint for third-party contract scanning.
[ ] Browser Extension: Real-time risk alerts during swaps.
⚠️ Disclaimer / Aviso Legal
PT: Esta ferramenta fornece análise automatizada e não substitui uma auditoria formal.
EN: This tool provides automated analysis and should not replace a full smart contract audit.
👨‍💻 Author / Desenvolvedor
Daniel Roberto Diniz - CEO Agência IA Diniz
Student of Systems Analysis and Development (ADS)
<p align="center">
<b>🔗 Live Demo:</b> <a href="https://web3-risk-monitor-zewe.vercel.app/">web3-risk-monitor-zewe.vercel.app</a>
</p>
