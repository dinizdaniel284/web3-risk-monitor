🛡️ Web3 Risk Monitor — Agência IA Diniz
�
�
�
🚀 Live Demo
👉 Open the application
https://web3-risk-monitor-zewe.vercel.app/
Deployment powered by Vercel
🌍 About the Project
🇧🇷 Português
O Web3 Risk Monitor é uma plataforma full-stack de segurança para análise de Smart Contracts e endereços de carteira.
O sistema utiliza análise automatizada para identificar:
vulnerabilidades críticas
padrões suspeitos
riscos de centralização
possíveis contratos maliciosos
Ao final da análise, a aplicação gera um score de risco de 0 a 100 para ajudar investidores e desenvolvedores a tomarem decisões mais seguras no ecossistema Web3.
🇺🇸 English
Web3 Risk Monitor is a full-stack security platform designed to analyze smart contracts and wallet addresses.
The system automatically detects:
critical vulnerabilities
suspicious behavior patterns
centralization risks
potentially malicious contracts
The platform generates a risk score from 0 to 100, helping users make safer decisions when interacting with Web3 applications.
⚙️ How the System Works
1️⃣ Wallet Connection
User connects a wallet using MetaMask.
2️⃣ Smart Contract Input
User provides a smart contract address.
3️⃣ Blockchain Data Fetch
Backend retrieves contract information using blockchain RPC calls via Ethers.js.
4️⃣ Risk Analysis
The analysis engine evaluates patterns related to:
ownership concentration
proxy contracts
suspicious permissions
abnormal contract behavior
5️⃣ Risk Report
The system returns a risk score (0-100) with insights about possible vulnerabilities.
🏗 System Architecture
Copiar código

User / MetaMask
        │
        ▼
Frontend (Next.js)
        │
        ▼
Backend API (Node.js + TypeScript)
        │
        ├── Blockchain RPC (Ethers.js)
        │
        └── Risk Analysis Engine
                │
                ▼
            Supabase
🧰 Tech Stack
Frontend
Next.js
TypeScript
Backend
Node.js
API architecture
Blockchain Integration
Ethers.js
Database
Supabase
Deployment
Vercel
🚀 Getting Started
Clone the repository


git clone https://github.com/dinizdaniel284/web3-risk-monitor.git
Install dependencies


npm install
Run the development server


npm run dev
🗺 Roadmap
Planned improvements for future versions:
Smart Contract Bytecode Deep Analysis
Public API for contract risk scanning
Browser Extension for wallet protection
Multi-chain monitoring
Advanced anomaly detection
⚠️ Disclaimer
🇧🇷
Esta ferramenta fornece análise automatizada e não substitui uma auditoria profissional de contratos inteligentes.
🇺🇸
This tool provides automated analysis and should not replace a professional smart contract audit.
👨‍💻 Author
Daniel Roberto Diniz
Founder — Agência IA Diniz
Student of Systems Analysis and Development (ADS)
🔗 Project Links
Live Application
https://web3-risk-monitor-zewe.vercel.app/
Source Code
https://github.com/dinizdaniel284/web3-risk-monitor
