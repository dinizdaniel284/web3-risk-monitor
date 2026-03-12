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

## 🏗️ Arquitetura do Fluxo / System Flow

```mermaid
graph LR
  A[User/MetaMask] --> B[Frontend Next.js]
  B --> C[Backend Node.js/TS]
  C --> D[Blockchain RPC / Ethers]
  C --> E[AI Analysis Engine]
  E --> F[Supabase DB]
  F --> B
🛠️ Especificações Técnicas / Technical Specs
EOA/Contract Validation: Algoritmo de detecção automática de tipo de endereço (Carteira vs Contrato).
Proxy Detection: Identificação de contratos alteráveis (upgradable) que representam risco de governança.
AI Risk Scoring: Relatórios descritivos gerados por IA com pontuação de risco de 0 a 100.
Web3 Integration: Conexão nativa via MetaMask e suporte multichain (Ethereum, Polygon, Sepolia).
🚀 Roadmap & Future Features
[ ] Smart Contract Bytecode Analysis: Deep scanning of unverified contracts.
[ ] Automated Alerts: Telegram/Discord integration for real-time monitoring.
[ ] DeFi Protocol Risk Detection: Advanced liquidity and rug-pull analysis.
⚠️ Disclaimer / Aviso Legal
PT: Esta ferramenta fornece análise automatizada e não substitui uma auditoria formal de segurança. Use apenas para fins informativos.
EN: This tool provides automated analysis and should not replace a full smart contract audit. Use for informational purposes only.
🏗️ Infraestrutura / Infrastructure
Frontend: Next.js (Vercel)
Backend: Node.js & TypeScript (Render)
Database: Supabase (PostgreSQL)
👨‍💻 Author / Desenvolvedor
Daniel Roberto Diniz - CEO Agência IA Diniz
Student of Systems Analysis and Development (ADS)
<p align="center">
<b>🔗 Live Demo:</b> <a href="https://web3-risk-monitor-zewe.vercel.app/">web3-risk-monitor-zewe.vercel.app</a>
</p>

