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
ng test --watch        # Run tests in watch mode
ng test --include="**/button.component.spec.ts"   # Run single test file
ng test --include="**/button.component.spec.ts" --watch  # Single test with watch
```

### Additional
```bash
ng extract-i18n        # Extract internationalization strings
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
├── guards/           # Route guards
├── directives/       # Angular directives
└── utils/            # Utility functions
```

## Naming Conventions

- **Components**: `kebab-case` selectors, `PascalCase` classes (e.g., `selector: 'app-button'`, `ButtonComponent`)
- **Files**: `kebab-case` (`.component.ts`, `.service.ts`, `.spec.ts`)
- **Classes**: `PascalCase`
- **Variables/Methods**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` with `Interface` suffix when needed
- **Enums**: `PascalCase` with values in `UPPER_SNAKE_CASE`

## TypeScript

- **Strict mode enabled**: All strict compiler options are on
- **Type annotations**: Always use explicit types for function parameters and return types
- **Optional properties**: Use `?` operator (e.g., `price?: Price`)
- **Use `inject()`**: Prefer dependency injection via `inject()` over constructor injection
- **Use `any` sparingly**: Avoid `any`; use proper types or `unknown`

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

### Services
- Use `@Injectable({ providedIn: 'root' })` for singleton services
- Use `inject()` for dependency injection
- Return `Observable` from service methods
- Handle errors with `catchError` returning `of()`

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private requestService = inject(RequestService);

  getProductById(id: string): Observable<GetProductByIdOutput> {
    return this.requestService.getRequest({ path: `/product/${id}` }).pipe(
      catchError(() => of({ message: 'Error message' }))
    );
  }
}
```

### Error Handling
- Always use `catchError` for service calls
- Return fallback values (empty arrays, error objects)
- Use Spanish error messages: `'No se pudo obtener el producto'`

### Imports Order
1. Angular core imports
2. Third-party libraries
3. Internal application imports

Use relative paths from the file location.

## Templates (HTML)

- Use semantic HTML elements with Tailwind CSS classes
- Use Angular directives (`*ngIf`, `*ngFor`, `[disabled]`, `(click)`)
- Keep templates clean; move complex logic to component

## Testing

- Use `TestBed.configureTestingModule` with `imports: [Component]`
- Use `ComponentFixture` for component testing
- Create helper components for testing content projection (`ng-content`)
- Use descriptive test names in Spanish
- Use `spyOn` for method spying and `.withContext()` for better error messages

## CSS / Styling

- Use Tailwind CSS utility classes in templates
- Use `styleUrl` (singular) for single style file, `styleUrls` for multiple
- Avoid global styles; use Tailwind utilities

## Routes

- Define routes in `app.routes.ts`
- Use lazy loading: `{ path: 'products', loadComponent: () => import('...').then(m => m.ProductsComponent) }`
- Use guards for protected routes

## Models

- Implement interface-based models with constructor parameters
- Create instances with `new Model(data)`

```typescript
export class Product implements ProductInterface {
  _id: string;
  createdAt: number;

  constructor(params: ProductInterface) {
    this._id = params._id;
  }
}
```

## RxJS

- Use `takeUntilDestroyed()` or unsubscribe for subscriptions
- Use proper operators: `catchError`, `switchMap`, `map`, etc.
- Return `Observable` from service methods

## Common Patterns

### API Service Wrapper
```typescript
this.requestService.getRequest({ path, query });
this.requestService.postRequest({ path, body });
this.requestService.putRequest({ path, body });
this.requestService.deleteRequest({ path });
```

### Environment Configuration
- Use `src/environments/environment.ts` and `environment.prod.ts`
- Custom `set-env.js` script runs before build/serve
