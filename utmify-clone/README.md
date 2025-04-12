This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Bueiro Digital - UTM Campaign Tracking Tool

Bueiro Digital is a comprehensive UTM campaign tracking tool that helps marketers manage, analyze, and optimize their marketing campaigns across various channels.

## Features

- **Campaign Management**: Create, edit, and track marketing campaigns with UTM parameters
- **Advanced Analytics**: Detailed analytics and visualizations for campaign performance
- **Global Search**: Search across all campaigns with advanced filtering options
- **Campaign Comparison**: Compare multiple campaigns side by side
- **Social Sharing**: Share campaign links via email, WhatsApp, and social media platforms
- **Integration Support**: Connect with multiple marketing platforms such as Ticto, ClickBank, and BuyGoods
- **Admin Dashboard**: Comprehensive admin interface with sales metrics and platform management

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: High-quality UI components
- **Zustand**: State management
- **Recharts**: Data visualization library

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/bueiro-digital.git
   ```

2. Install dependencies
   ```bash
   cd utmify-clone
   bun install
   ```

3. Run the development server
   ```bash
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploying to Netlify

1. Create a new site on Netlify
2. Connect your repository
3. Use the following build settings:
   - Build command: `bun run build`
   - Publish directory: `.next`
4. Add the following environment variables:
   - `NEXT_TELEMETRY_DISABLED`: `1`

You can also use the Netlify CLI for deployment:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize a new Netlify site
netlify init

# Deploy to Netlify
netlify deploy --prod
```

### Deploying to Vercel

1. Create a new project on Vercel
2. Connect your repository
3. Vercel will automatically detect Next.js settings
4. Deploy

You can also use the Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
