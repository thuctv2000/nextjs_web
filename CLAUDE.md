# Next.js Project Rules

You are an expert in TypeScript, React 19, Next.js 16 App Router, Tailwind CSS, and Zustand.

## Code Style

- Write concise, technical TypeScript code
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`, `canSubmit`)
- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)

## File Structure

```
src/
├── app/                    # App Router pages & layouts
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                   # Utilities & helpers
├── hooks/                 # Custom hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## Component Structure

Order within component files:
1. Exported component
2. Subcomponents
3. Helper functions
4. Static content
5. Types/Interfaces

```tsx
// Example component structure
interface Props {
  title: string
  isLoading?: boolean
}

export function MyComponent({ title, isLoading = false }: Props) {
  // hooks first
  // handlers
  // render
}

function SubComponent() { }

function helperFunction() { }

const STATIC_DATA = []
```

## TypeScript

- Use TypeScript for all code
- Prefer `interface` over `type` for object shapes
- Avoid enums; use `const` objects or maps instead
- Always define explicit return types for functions
- Use functional components with TypeScript interfaces for props

```tsx
// Good
interface User {
  id: string
  name: string
}

const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
} as const

// Avoid
type User = { id: string; name: string }
enum Status { PENDING, ACTIVE }
```

## React & Next.js

- Favor React Server Components (RSC) by default
- Minimize `'use client'` - only use for interactivity, Web APIs, or hooks
- Minimize `useEffect` and `useState`; prefer server-side data fetching
- Use `Suspense` with fallbacks for client components
- Use dynamic imports for non-critical components

```tsx
// Server Component (default)
async function ProductList() {
  const products = await getProducts()
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

// Client Component (only when needed)
'use client'
function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## Data Fetching

- Use Server Components for data fetching when possible
- Use `fetch` with Next.js caching options
- Implement proper loading and error states
- Use `loading.tsx` and `error.tsx` for route segments

```tsx
// In Server Component
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // Cache for 1 hour
})
```

## State Management

- Use Zustand for global client state
- Use `nuqs` for URL search parameter state
- Use React Context sparingly (for theme, auth)
- Prefer server state over client state

```tsx
// Zustand store
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

## Styling

- Use Tailwind CSS for all styling
- Follow mobile-first responsive design
- Avoid inline styles and global CSS
- Use CSS variables for theme customization
- Use semantic HTML elements

```tsx
// Good
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md md:px-6">
  Submit
</button>

// Avoid
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Submit
</button>
```

## Performance

- Optimize Web Vitals (LCP, CLS, FID)
- Use `next/image` for images with proper sizing
- Use WebP format for images
- Implement lazy loading for below-fold content
- Use `next/font` for font optimization

```tsx
import Image from 'next/image'

<Image
  src="/hero.webp"
  alt="Hero"
  width={1200}
  height={600}
  priority // for above-fold images
/>
```

## API Routes

- Place routes under `app/api/{resource}/route.ts`
- Use Zod for request validation
- Return proper HTTP status codes
- Handle errors gracefully

```tsx
// app/api/users/route.ts
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 })
  }

  // Process valid data
  return Response.json({ success: true }, { status: 201 })
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files/Folders | lowercase-dash | `user-profile.tsx` |
| Components | PascalCase | `UserProfile` |
| Functions | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_ITEMS` |
| Types/Interfaces | PascalCase | `UserProfile` |

## Exports

- Use named exports for components
- Use default exports only for pages

```tsx
// components/button.tsx
export function Button() { }

// app/about/page.tsx
export default function AboutPage() { }
```
