🛡️ Web3 Risk Monitor — Agência IA Diniz
�
￼ ￼ ￼ 

�
￼ ￼ ￼ ￼ ￼ 

🚀 Live Demo
👉 https://web3-risk-monitor-zewe.vercel.app/⁠�
🌍 About the Project
🇧🇷 Português
O Web3 Risk Monitor é uma plataforma full-stack de segurança que utiliza IA para auditorias rápidas em Smart Contracts e endereços de carteira.
O sistema identifica automaticamente:
vulnerabilidades críticas
padrões suspeitos
riscos de centralização
possíveis contratos maliciosos
Tudo isso gerando um score de risco de 0 a 100 para ajudar investidores e desenvolvedores a tomarem decisões mais seguras.
🇺🇸 English
Web3 Risk Monitor is a full-stack security platform that leverages AI to perform rapid audits of smart contracts and wallet addresses.
The system automatically detects:
critical vulnerabilities
suspicious patterns
centralization risks
potential malicious contracts
The result is a 0-100 risk score to help users make safer Web3 decisions.
🎥 Demo (GitHub GIF Preview)
�

�
￼
�

Example workflow:
1️⃣ Connect wallet via MetaMask
2️⃣ Insert smart contract address
3️⃣ Fetch blockchain data
4️⃣ Run AI security analysis
5️⃣ Generate risk score report
⚙️ How It Works
1️⃣ Wallet Connection
User connects a wallet using MetaMask.
2️⃣ Smart Contract Input
User provides a smart contract address for analysis.
3️⃣ Blockchain Data Fetch
The backend retrieves contract data using Ethers.js.
4️⃣ AI Risk Analysis
A custom AI engine analyzes patterns such as:
proxy contracts
ownership concentration
unusual behavior patterns
5️⃣ Risk Score
The system generates a risk score from 0 to 100 with a detailed report.
🏗 System Architecture
Mermaid
Copiar código
graph LR
  A[User / MetaMask] --> B[Frontend - Next.js]
  B --> C[Backend - Node.js + TypeScript]
  C --> D[Blockchain RPC / Ethers.js]
  C --> E[AI Analysis Engine]
  E --> F[Supabase Database]
  F --> B
🧰 Tech Stack
Frontend
Next.js
TypeScript
Backend
Node.js
API services
Blockchain
Ethers.js
Database
Supabase
Deployment
Vercel
🚀 Getting Started
Clone the repository
Copiar código

git clone https://github.com/dinizdaniel284/web3-risk-monitor.git
Install dependencies
Copiar código

npm install
Run development server
Copiar código

npm run dev
🗺 Roadmap
Future improvements planned for the project:
Smart Contract Bytecode Deep Analysis
Public API for contract scanning
Browser Extension for wallet protection
Multi-chain monitoring
AI anomaly detection
⚠️ Disclaimer
🇧🇷
Esta ferramenta fornece análise automatizada e não substitui uma auditoria profissional de smart contracts.
🇺🇸
This tool provides automated analysis and should not replace a professional smart contract audit.
👨‍💻 Author
Daniel Roberto Diniz
CEO — Agência IA Diniz
Student of Systems Analysis and Development (ADS)
🔗 Project Links
Live Application
https://web3-risk-monitor-zewe.vercel.app/⁠�
Source Code
https://github.com/dinizdaniel284/web3-risk-monitor⁠�
