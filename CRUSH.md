# NBA Scores Extension - Development Guide

## Commands
- `npm run build` - Production build (TypeScript check + Vite build)
- `npm run lint` - ESLint validation (max 0 warnings allowed)
- `npm run type-check` - TypeScript validation without emitting
- `npm run dev` - Development server
- No test framework configured

## Code Style

### Imports & Formatting
- Use absolute imports with `@/` prefix for src files
- Group imports: React/external → internal components → types → utils
- Use `clsx` and `tailwind-merge` for conditional styling
- Follow shadcn/ui component patterns

### TypeScript
- Strict mode enabled - all types must be defined
- Use interfaces for objects, types for unions/primitives
- Prefix unused params with `_` (ESLint rule)
- Avoid `any` type (ESLint warns)

### Naming Conventions
- Components: PascalCase, descriptive names
- Hooks: `use` prefix (camelCase)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case (utils), PascalCase (components)

### Error Handling
- Use ErrorBoundary for React errors
- TanStack Query for async state with fallbacks
- Chrome extension storage with error handling
- Service layer for API calls with graceful fallbacks

### Architecture
- Custom hooks for data fetching (TanStack Query)
- Type-safe interfaces in `/types` directory
- Component structure: common/ → features/ → ui/
- Zod schemas for validation