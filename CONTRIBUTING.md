# Contributing to SolarSense

Thanks for your interest in contributing to SolarSense. We welcome improvements, bug fixes, feature ideas, and documentation updates.

## Getting Started

1. Fork the repository.
2. Clone your fork locally.
3. Create a feature branch from `main`.
4. Install dependencies for both the frontend and backend.

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

## Project Structure

```text
client/        # React + Vite frontend
server/        # Express.js backend
README.md      # Project overview
CONTRIBUTING.md
```

## Contribution Guidelines

- Keep changes focused and relevant to a single issue or feature.
- Follow the existing project coding style and structure.
- Write clear commit messages.
- Update documentation when changing behavior, setup steps, or environment variables.
- Test your changes before submitting a pull request.

## Branching

Use descriptive branch names such as:

```bash
git checkout -b feature/solar-calculator-improvement
git checkout -b fix/auth-flow-bug
git checkout -b docs/setup-guide
```

## Commit Messages

Use clear and concise commit messages:

```bash
git commit -m "Add roof verification map improvements"
git commit -m "Fix solar savings calculation edge case"
git commit -m "Update README setup instructions"
```

## Pull Request Process

1. Push your branch to your fork.
2. Open a pull request against the main repository.
3. Include a clear description of:
   - what changed
   - why it changed
   - how it was tested
4. Link related issues if applicable.
5. Address review comments before merging.

## Reporting Bugs

Please include:

- a short summary of the bug
- steps to reproduce
- expected behavior
- actual behavior
- screenshots if helpful
- relevant environment details

## Feature Requests

Feature requests are welcome. Please describe:

- the problem being solved
- the proposed solution
- any alternatives considered
- expected user impact

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming environment for everyone.

## Questions

If you are unsure about anything, open an issue or ask in the discussion section before making large changes.

Thank you for contributing to SolarSense!
