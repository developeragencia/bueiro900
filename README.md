# Bueiro Digital

Sistema de gestão de métricas para marketing digital.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Prisma
- Firebase (Auth & Storage)
- SQLite
- TailwindCSS

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Firebase

## Configuração

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd bueiro-digital
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env.local`
- Preencha as variáveis com suas credenciais do Firebase

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Funcionalidades

- Autenticação de usuários com Firebase
- Dashboard de métricas
- Gestão de campanhas
- Relatórios de desempenho
- Análise de ROI e ROAS

## Estrutura do Projeto

```
bueiro-digital/
├── app/              # Rotas e componentes Next.js
├── components/       # Componentes React reutilizáveis
├── lib/             # Configurações e utilitários
├── prisma/          # Schema e migrações do banco de dados
└── public/          # Arquivos estáticos
```

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
