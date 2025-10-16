# Repository Guidelines

## Project Structure & Module Organization
- Core TypeScript sources sit in `src/`, covering motion primitives and platform helpers (`linear-gradient*.ts`, `svg.ts`); colocate tests under `src/__tests__/`.
- Build artefacts land in `lib/` via React Native Builder Bob—treat this directory as generated.
- Public entry points (`index.js`, `svg.js`, `linear-gradient*.js`, `styled.js`) surface the compiled bundles and typings. Use `example/` to validate end-to-end behaviour before publishing.

## Build, Test, and Development Commands
- `npm run lint` – ESLint + Prettier check across `*.js/ts/tsx`.
- `npm run typescript` – type-check the project using `tsc --noEmit`.
- `npm test` – execute the Jest suite configured for React Native.
- `npm run prepare` – build CommonJS, ESModule, and declaration outputs into `lib/` (invoked automatically on install/publish).
- `npm run bootstrap` – install root and example dependencies, then run CocoaPods (`pod-install`).

## Coding Style & Naming Conventions
- Prettier governs formatting: 4-space indent, 140-character width, single quotes, trailing commas, required semicolons.
- Write new logic in TypeScript; suffix platform-specific variants (`LinearGradient.tsx`, `linear-gradient-expo.ts`) and align filenames with export casing (PascalCase components, camelCase hooks).
- For sweeping edits, run `npx prettier --write "src/**/*.{ts,tsx,js}"` before committing.

## Testing Guidelines
- Jest with the React Native preset backs the suite; add specs in `src/__tests__/` using the `*.test.tsx` convention.
- Stub native modules to keep tests deterministic, borrowing patterns from existing mocks.
- Cover animation timing or interpolation logic with explicit assertions and run `npm test` before every PR.

## Commit & Pull Request Guidelines
- Commitlint enforces Conventional Commits; start messages with `feat:`, `fix:`, `chore:`, etc. (e.g., `fix: stabilize spring defaults`).
- Squash fixups, reference issues when relevant, and call out breaking changes with migration notes.
- PRs should supply a concise summary, implementation context, UI captures when behaviour shifts, and the verification commands you ran (`npm test`, `npm run lint`, ...).

## Example App & Native Setup
- To exercise native flows, run `npm run bootstrap`, start the example (`cd example && npm start`), then launch your target (`npx react-native run-ios` or similar).
- Update the example alongside API changes so usage snippets stay accurate.
