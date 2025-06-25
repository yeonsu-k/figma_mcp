# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Figma MCP** is a design token management system that creates a seamless bridge between Figma (via Tokens Studio) and TailwindCSS v4. It automatically transforms design tokens into CSS custom properties and provides a visual showcase for the design system.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run generate` - Generate static site for GitHub Pages deployment
- `npm run preview` - Preview production build locally

### Design Token Management
- `npm run tokens:build` - Transform tokens from `tokens/global.json` to CSS variables and API JSON
- `npm run tokens:watch` - Watch token files and auto-rebuild on changes (essential for development)
- `npm run tokens:clean` - Clean generated token files

### Deployment
- `npm run deploy:build` - Build tokens + generate static site for deployment
- `npm run deploy:preview` - Preview deployment build locally

### Legacy Token Support
- `npm run tokens:legacy:build` - Build tokens with legacy TailwindCSS v3 format
- `npm run tokens:legacy:watch` - Watch with legacy format
- `npm run tokens:legacy:clean` - Clean legacy token files

## Architecture

### Design Token Pipeline
1. **Source**: `tokens/global.json` (exported from Figma Tokens Studio)
2. **Transformation**: `transform-tokens.js` uses `token-transformer` + Style Dictionary
3. **Output**: 
   - `assets/css/design-tokens.css` (TailwindCSS v4 variables)
   - `public/api/tokens.json` (static API for GitHub Pages)
4. **Integration**: CSS custom properties via `@theme`, `@layer base`, `@layer components`

### Token Types Supported
- **Colors**: Brand palettes and single colors
- **Spacing**: Padding, margin, gap values
- **Typography**: Font families and composite text styles
- **Assets**: Image and icon URLs
- **Borders**: Complex border definitions (width, style, color)
- **Opacity**: Transparency values
- **Border Radius**: Corner radius values

### Component Architecture
- **Token Display**: Modular components in `components/` for each token type
- **Composables**: `useTokens`, `useTokenCategories`, `useTokenExtractors`, `useClipboard`
- **API Strategy**: Dual approach - server API for development, static JSON for GitHub Pages
- **State Management**: Pinia stores for authentication and token management

### Configuration Files
- **Nuxt Config**: SPA mode enabled, GitHub Pages optimization, TailwindCSS v4 integration
- **TailwindCSS**: Uses `@theme` directive for CSS custom properties, Vite plugin for v4
- **Style Dictionary**: Custom transforms in `transform-tokens.js` for TailwindCSS v4 compatibility

## Development Workflow

### Working with Tokens
1. Update `tokens/global.json` (usually exported from Figma Tokens Studio)
2. Run `npm run tokens:watch` to auto-rebuild on changes
3. Changes appear instantly in the dev server
4. For production, tokens are built automatically via GitHub Actions

### Local Development
1. `npm install`
2. `npm run tokens:build` (initial token build)
3. `npm run dev` (start dev server)
4. `npm run tokens:watch` (in separate terminal for token hot-reload)

### Adding New Token Types
1. Add extraction logic in `composables/useTokenExtractors.js`
2. Create display component in `components/tokens/`
3. Add to token categories in `composables/useTokenCategories.js`
4. Update token processing in `transform-tokens.js` if needed

## Deployment

### GitHub Actions Workflows
- **Build & Deploy** (`build-and-deploy.yml`): Triggers on push to `figma_style` branch
  - Builds tokens from `tokens/global.json`
  - Commits generated files
  - Deploys to GitHub Pages
- **Token Validation** (`validate-tokens.yml`): Validates token structure on PRs

### Manual Deployment
1. `npm run deploy:build`
2. Generated files are committed automatically by GitHub Actions
3. Site deploys to GitHub Pages at `https://yeonsu-k.github.io/figma_mcp/`

## Key Files

### Token Processing
- `transform-tokens.js` - Main token transformation script
- `tokens/global.json` - Source tokens from Figma Tokens Studio
- `assets/css/design-tokens.css` - Generated TailwindCSS v4 variables

### Configuration
- `nuxt.config.ts` - Nuxt configuration with GitHub Pages setup
- `tailwind.config.js` - TailwindCSS v4 configuration with custom theme

### Components
- `pages/index.vue` - Main token showcase page
- `components/tokens/` - Token-specific display components
- `composables/useTokens.js` - Core token management logic

## TailwindCSS v4 Integration

This project uses TailwindCSS v4 with CSS custom properties via the `@theme` directive. Design tokens are automatically converted to CSS variables that TailwindCSS can consume. The transformation ensures compatibility between Tokens Studio format and TailwindCSS v4 expectations.

## Testing

Token validation happens automatically through GitHub Actions. For local testing:
- Use `npm run tokens:build` to verify token transformation
- Check browser console for any token parsing errors
- Verify visual output in the token showcase page