# AGENTS.md - Development Guidelines

This document provides guidelines for agentic coding agents working in this Angular 19 project.

## Project Overview

- **Framework**: Angular 19 (standalone components)
- **Styling**: Tailwind CSS v4 (see DESIGN.md for "Nocturnal Interface" theme)
- **Testing**: Karma + Jasmine
- **TypeScript**: Strict mode enabled

## Commands

### Development
```bash
npm start              # Start dev server (runs set-env.js first)
npm run watch          # Build in watch mode (development)
```

### Build
```bash
npm run build          # Production build
```

### Testing
```bash
npm test               # Run all tests (headless by default)
ng test --watch       # Run tests in watch mode
ng test --include="**/component.spec.ts"   # Run single test file
ng test --include="**/product.service.spec.ts"   # Run single service test
```

### Type Checking
```bash
npx tsc --noEmit       # Run TypeScript type checking (strict mode)
```

## File Structure

```
src/app/
├── components/        # Reusable UI components
├── pages/            # Route-level components
├── services/         # Angular services (HTTP calls)
├── models/           # Data model classes
├── interfaces/       # TypeScript interfaces
├── enums/            # TypeScript enums
├── guards/           # Route guards
├── directives/       # Angular directives
└── utils/            # Utility functions
```

## TypeScript Strict Mode

Enabled: `strict: true`, `noImplicitOverride: true`, `noPropertyAccessFromIndexSignature: true`, `noImplicitReturns: true`, `noFallthroughCasesInSwitch: true`, `strictInjectionParameters: true`, `strictTemplates: true`

## Naming Conventions

- **Components**: `kebab-case` selectors, `PascalCase` classes (e.g., `selector: 'app-button'`)
- **Files**: `kebab-case` (`.component.ts`, `.service.ts`, `.spec.ts`)
- **Classes**: `PascalCase`, **Variables/Methods**: `camelCase`, **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` (e.g., `ProductInterface`), **Enums**: values in `UPPER_SNAKE_CASE`

## Code Style

- **Formatting**: 2 spaces indentation, max 100 chars line length, semicolons, single quotes
- **Types**: Explicit types for parameters/returns, avoid `any`, handle null/undefined explicitly
- **Optional properties**: Use `?` operator (e.g., `price?: Price`)
- **Early returns**: Prefer for validation checks

## Imports Order

1. Angular core imports (`@angular/*`)
2. Third-party libraries
3. Internal application imports (use relative paths)

## Angular Patterns

### Standalone Components
```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {}
```

### Dependency Injection
```typescript
private productService = inject(ProductService);
```

### Services
- Use `@Injectable({ providedIn: 'root' })` for singletons
- Return `Observable` from methods
- Handle errors with `catchError` returning `of()`
- Use Spanish error messages (e.g., `'No se pudo obtener el producto'`)

## Templates (HTML)

- Use semantic HTML with Tailwind CSS classes (see DESIGN.md for "Nocturnal Interface" colors)
- Use Angular directives (`[disabled]`, `(click)`, etc.)
- Move complex logic to component class
- Use `@if`, `@for` (Angular 17+ control flow) over `*ngIf`, `*ngFor`

## Testing

- Use `TestBed.configureTestingModule` with `imports: [Component]`
- Use `ComponentFixture` for component testing
- Descriptive test names in Spanish (e.g., `deberia mostrar el boton`)
- Use `spyOn` for method spying, mock HTTP with `HttpTestingController`
- Use `.withContext()` for better error messages

## Routes

- Define in `app.routes.ts`
- Use lazy loading: `{ path: 'products', loadComponent: () => import('...').then(m => m.ProductsComponent) }`
- Use guards for protected routes, `pathMatch: 'full'` for empty path redirects

## Models
```typescript
export interface ProductInterface {
  _id: string;
  name: string;
  price: number;
  createdAt?: number;
}
```

## RxJS

- Use `takeUntilDestroyed()` or unsubscribe for subscriptions
- Use operators: `catchError`, `switchMap`, `map`, `tap`, etc.
- Return `Observable` from service methods
- Use `async` pipe in templates for subscriptions

## Environment Configuration

- Use `src/environments/environment.ts` and `environment.prod.ts`
- Custom `set-env.js` script runs before build/serve
- Never commit secrets or API keys

## Design System (DESIGN.md)

Follow "The Nocturnal Interface" theme:
- **Colors**: Background `#0c0d18`, Primary `#afa2ff`, Surface `#171926` to `#232534`, Text `#eeecfc`
- **No-Line Rule**: Use background color shifts instead of borders for sectioning
- **Glassmorphism**: 12-20px blur on semi-transparent surfaces
- **Typography**: Inter font, editorial hierarchy with size contrast
- **Elevation**: Layer by luminosity shifts, use diffused shadows
- **Components**: 0.75rem radius, no sharp corners, no divider lines