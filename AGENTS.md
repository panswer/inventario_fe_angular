# AGENTS.md

## Key Commands

```bash
npm start    # Dev server (runs set-env.js first - important!)
npm run build
npm test     # Headless by default
ng test --watch
ng test --include="**/component.spec.ts"  # Single file
npx tsc --noEmit  # TypeScript strict check
```

## Architecture

- **Angular 19**: Standalone components, signals, `@if`/`@for` control flow
- **State**: Services with `BehaviorSubject`, return `Observable` from methods
- **Styling**: Tailwind CSS v4 + "Nocturnal Interface" theme (see DESIGN.md)

## Repo-Specific Conventions

- **Error messages**: Use Spanish (e.g., `'No se pudo obtener el producto'`)
- **Test names**: Spanish (e.g., `deberia mostrar el boton`)
- **HTTP errors**: Handle 400, 401, 404, 500 explicitly
- **Services**: Use `catchError` with `return of(null)` or error value

## File Structure

```
src/app/
├── components/   # Reusable UI
├── pages/        # Route-level components
├── services/     # HTTP + state (BehaviorSubject)
├── models/       # Data model classes
├── interfaces/   # TypeScript interfaces (PascalCase: ProductInterface)
├── enums/        # Values in UPPER_SNAKE_CASE
└── utils/        # Utility functions
```

## TypeScript Strict

Enabled: `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `strictInjectionParameters`, `strictTemplates`

## Environment

- `set-env.js` runs automatically before `npm start`/`npm run build`
- Use `src/environments/environment.ts` / `environment.prod.ts`
- Never commit secrets

## Testing

- Karma + Jasmine, `HttpTestingController` for mocking
- Use `TestBed.configureTestingModule` with `imports: [Component]`
- `spyOn` for method spying, `.withContext()` for error messages