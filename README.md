# 🛡️ Web3 Risk Monitor — Agência IA Diniz

<p align="center">
  <img src="https://raw.githubusercontent.com/dinizdaniel284/web3-risk-monitor/main/public/banner.gif" alt="Web3 Risk Monitor Banner" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-blue?style=for-the-badge&logo=github" alt="Status">
  <img src="https://img.shields.io/badge/Web3-Security-black?style=for-the-badge&logo=ethereum" alt="Web3">
  <img src="https://img.shields.io/badge/Next.js-14-white?style=for-the-badge&logo=nextdotjs" alt="NextJS">
</p>

---

## 🚀 Live Demo
> **Acesse agora:** [https://web3-risk-monitor-zewe.vercel.app/](https://web3-risk-monitor-zewe.vercel.app/)
> *Deployment powered by Vercel* 🌍

---

## 🌍 Sobre o Projeto | About the Project

### 🇧🇷 Português
O **Web3 Risk Monitor** é uma plataforma full-stack de elite voltada para a segurança de Smart Contracts e análise de carteiras. O sistema utiliza algoritmos avançados para identificar:
* 🔴 **Vulnerabilidades Críticas**
* 🟡 **Padrões Suspeitos**
* 🟠 **Riscos de Centralização**
* 💀 **Contratos Maliciosos (Honeypots)**

### 🇺🇸 English
**Web3 Risk Monitor** is a premier full-stack security platform. It analyzes smart contracts and wallet addresses to detect:
* **Critical Vulnerabilities** & **Suspicious Behavior**
* **Centralization Risks** & **Malicious Contracts**
* Generates a **Risk Score (0-100)** for safer decision-making.

---

## ⚙️ Como o Sistema Funciona | How it Works

<img align="right" src="https://raw.githubusercontent.com/dinizdaniel284/web3-risk-monitor/main/public/workflow.gif" width="300">

1.  **Wallet Connection:** O usuário conecta via MetaMask.
2.  **Smart Contract Input:** Inserção do endereço do contrato.
3.  **Data Fetch:** O Backend busca dados via **Ethers.js (RPC calls)**.
4.  **Risk Analysis:** Avaliação de concentração de posse, proxies e permissões.
5.  **Risk Report:** Entrega de um score de 0 a 100 com insights detalhados.

---

## 🏗 Arquitetura do Sistema

```mermaid
graph TD
    A[User / MetaMask] --> B[Frontend Next.js]
    B --> C[Backend API Node.js]
    C --> D[Blockchain RPC Ethers.js]
    C --> E[Risk Analysis Engine]
    C --> F[(Supabase DB)]

🧰 Tech Stack

Camada Tecnologia
Frontend Next.js TypeScript Tailwind CSS
Backend Node.js API Architecture
Web3 Ethers.js Smart Contracts
Database Supabase
Deploy Vercel

🚀 Começando | Getting Started
# Clone o repositório
git clone [https://github.com/dinizdaniel284/web3-risk-monitor.git](https://github.com/dinizdaniel284/web3-risk-monitor.git)

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev


🗺 Roadmap
[ ] Deep Analysis de Bytecode de Smart Contracts.
[ ] API Pública para varredura de risco.
[ ] Extensão de Browser para proteção de carteira em tempo real.
[ ] Monitoramento Multi-chain.
⚠️ Disclaimer
🇧🇷 Atenção: Esta ferramenta fornece análise automatizada e não substitui uma auditoria profissional.
🇺🇸 Warning: This tool provides automated analysis and does not replace a professional audit.
👨‍💻 Autor
Daniel Roberto Diniz
Founder — Agência IA Diniz
Student of Systems Analysis and Development (ADS)
<p align="left">
<a href="https://www.google.com/search?q=https://github.com/dinizdaniel284">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/GitHub-100000%3Fstyle%3Dfor-the-badge%26logo%3Dgithub%26logoColor%3Dwhite" />
</a>
</p>
[Ícone de Link]: Source Code
