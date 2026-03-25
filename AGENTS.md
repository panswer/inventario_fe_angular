# AGENTS.md - Development Guidelines

This document provides guidelines for agentic coding agents working in this Angular 19 project.

## Project Overview

- **Framework**: Angular 19 (standalone components)
- **Styling**: Tailwind CSS v4
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
```

### Type Checking
```bash
npx tsc --noEmit       # Run TypeScript type checking (strict mode)
```

## File Structure
```
src/app/
├── components/        # Reusable UI components (atoms/, molecules/)
├── pages/             # Route-level components (public/, private/)
├── services/          # Angular services (HTTP calls)
├── models/            # Data model classes
├── interfaces/        # TypeScript interfaces
├── enums/             # TypeScript enums
├── guards/            # Route guards
├── directives/        # Angular directives
└── utils/             # Utility functions
```

## TypeScript Strict Mode

The project uses strict TypeScript with these compiler options:
- `strict: true` - Enable all strict type checking
- `noImplicitOverride: true` - Require `override` keyword for overridden methods
- `noPropertyAccessFromIndexSignature: true` - Require dot notation for known properties
- `noImplicitReturns: true` - Ensure all code paths return a value
- `noFallthroughCasesInSwitch: true` - Require break in switch cases
- `strictInjectionParameters: true` - Strict type checking for DI
- `strictTemplates: true` - Strict template type checking

## Naming Conventions

- **Components**: `kebab-case` selectors, `PascalCase` classes (e.g., `selector: 'app-button'`, `ButtonComponent`)
- **Files**: `kebab-case` (`.component.ts`, `.service.ts`, `.spec.ts`)
- **Classes**: `PascalCase`
- **Variables/Methods**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` with `Interface` suffix when needed (e.g., `ProductInterface`)
- **Enums**: `PascalCase` with values in `UPPER_SNAKE_CASE`

## TypeScript Guidelines

- **Type annotations**: Always use explicit types for function parameters and return types
- **Optional properties**: Use `?` operator (e.g., `price?: Price`)
- **Avoid `any`**: Use proper types or `unknown` instead
- **Strict null checks**: Handle null/undefined explicitly
- **Generics**: Use generics for reusable components and services

## Angular Patterns

### Standalone Components
```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {}
```

### Dependency Injection
Use `inject()` function instead of constructor injection:
```typescript
private requestService = inject(RequestService);
```

### Services
- Use `@Injectable({ providedIn: 'root' })` for singleton services
- Return `Observable` from service methods
- Handle errors with `catchError` returning `of()`
- Use Spanish error messages: `'No se pudo obtener el producto'`

### Error Handling
- Always use `catchError` for service calls
- Return fallback values (empty arrays, error objects)
- Use `.withContext()` for better error messages in tests

## Imports Order

1. Angular core imports (`@angular/*`)
2. Third-party libraries
3. Internal application imports

Use relative paths from the file location.

## Templates (HTML)

- Use semantic HTML elements with Tailwind CSS classes
- Use Angular directives (`*ngIf`, `*ngFor`, `[disabled]`, `(click)`)
- Keep templates clean; move complex logic to component
- Use `@if`, `@for` (Angular 17+ control flow) over `*ngIf`, `*ngFor`

## Testing

- Use `TestBed.configureTestingModule` with `imports: [Component]`
- Use `ComponentFixture` for component testing
- Create helper components for testing content projection (`ng-content`)
- Use descriptive test names in Spanish (e.g., `deberia mostrar el boton`)
- Use `spyOn` for method spying
- Use `.withContext()` for better error messages

## CSS / Styling

- Use Tailwind CSS utility classes in templates
- Use `styleUrl` (singular) for single style file, `styleUrls` for multiple
- Configure Tailwind via CSS `@import "tailwindcss"` (v4)

## Routes

- Define routes in `app.routes.ts`
- Use lazy loading: `{ path: 'products', loadComponent: () => import('...').then(m => m.ProductsComponent) }`
- Use guards for protected routes
- Use `pathMatch: 'full'` for empty path redirects

## Models

Implement interface-based models with constructor parameters:
```typescript
export interface ProductInterface {
  _id: string;
  name: string;
  price: number;
  createdAt?: number;
}

export class Product implements ProductInterface {
  constructor(params: ProductInterface) {
    this._id = params._id;
    this.name = params.name;
    this.price = params.price;
    this.createdAt = params.createdAt ?? Date.now();
  }
}
```

## RxJS

- Use `takeUntilDestroyed()` or unsubscribe for subscriptions
- Use proper operators: `catchError`, `switchMap`, `map`, `tap`, etc.
- Return `Observable` from service methods
- Use `BehaviorSubject` for state management when needed

## Environment Configuration

- Use `src/environments/environment.ts` and `environment.prod.ts`
- Custom `set-env.js` script runs before build/serve
