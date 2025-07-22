# ContractGPT

AI-powered contract analysis tool. Built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/contract-gpt.git
   cd contract-gpt
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Copy the example file and add your keys:
   ```bash
   cp .env.example .env.local
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🧱 Tech Stack

- **Frontend:** [Next.js (App Router)](https://nextjs.org/docs/app), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com)
- **Backend:** Next.js API Routes
- **Database:** [Supabase](https://supabase.com) — User Auth, Saved Contracts, Versioning
- **AI:** [OpenAI GPT-4](https://openai.com) — Prompt Chaining
- **PDF Export:** [`react-pdf`](https://react-pdf.org) or [`html2pdf.js`](https://www.npmjs.com/package/html2pdf.js)
- **Tests:** [Vitest](https://vitest.dev) — Component Testing
