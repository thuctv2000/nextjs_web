# Frontend (fe)

Frontend web application built with Next.js and React.

## Tech Stack

- **Next.js 16.1.6**
- **React 19.2.3**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand** for state management

## Project Structure

```
fe/
├── src/
│   └── app/          # App Router pages & layouts
├── public/           # Static assets
├── .github/          # GitHub workflows
├── next.config.ts    # Next.js configuration
└── tsconfig.json     # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Build

```bash
npm run build
```

Static export output is in the `out/` directory.
