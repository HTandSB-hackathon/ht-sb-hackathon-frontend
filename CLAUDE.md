# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Code quality checks
npm run lint          # Run Biome linter
npm run format        # Check formatting with Biome
npm run check         # Run all Biome checks

# Fix code issues automatically
npm run format:fix    # Fix formatting issues
npm run lint:fix      # Fix linting issues
npm run check:fix     # Fix all issues (format + lint)

# Docker operations
docker compose up     # Start local development with Docker
```

## Architecture Overview

This is a React + TypeScript frontend application using Vite as the build tool. The architecture follows Atomic Design principles with a clear separation between UI components, state management, and API integration.

### Key Architectural Decisions

1. **State Management**: Uses Jotai for atomic state management instead of Redux/Context API. Atoms are persisted to localStorage when needed (e.g., authentication tokens).

2. **Authentication Flow**: JWT-based auth with support for both password and GitHub OAuth. Tokens are stored in localStorage and automatically injected into API requests via Axios interceptors.

3. **Component Structure**: 
   - `atoms/`: Basic UI components (buttons, forms)
   - `organisms/`: Complex components composed of atoms
   - `pages/`: Full page components for routing

4. **API Layer**: Centralized Axios client with interceptors for auth token injection and error handling. All API calls go through domain-specific query classes.

5. **Routing**: React Router with protected routes that check authentication state before rendering.

### Important Patterns

- **Path Aliasing**: Use `@/` to import from `src/` directory
- **Atomic State**: Create new atoms in `src/lib/atom/` for global state
- **API Integration**: Add new API endpoints in `src/lib/domain/` query classes
- **Protected Routes**: Wrap authenticated pages with `ProtectedRoute` component
- **UI Components**: Use Chakra UI v2 components and follow existing patterns

### Environment Configuration

- Development API: `http://localhost:8000/api/v1`
- Production API: `https://163.44.125.128/api-ht-sb/api/v1`
- Base path: `/ht-sb` (configured in vite.config.ts)

The application is deployed at a subpath, so all routes and assets are prefixed with `/ht-sb`.

### Code Style

- Use Biome for formatting and linting (tab indentation, double quotes)
- TypeScript strict mode is enabled - avoid `any` types
- Follow existing component patterns when creating new components
- Organize imports are automatically handled by Biome