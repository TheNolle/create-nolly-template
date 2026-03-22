# Contributing to create-nolly-template

Thank you for your interest in contributing to `create-nolly-template`! This project is a CLI tool that provides opinionated templates for various tech stacks, making it easier to bootstrap new projects. We welcome contributions from everyone, whether it's bug fixes, new features, documentation improvements, or adding new templates.

## Table of Contents

- [Contributing to create-nolly-template](#contributing-to-create-nolly-template)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Development Setup](#development-setup)
  - [Project Structure](#project-structure)
  - [Adding New Templates](#adding-new-templates)
  - [Coding Guidelines](#coding-guidelines)
  - [Testing](#testing)
  - [Submitting Changes](#submitting-changes)
  - [Reporting Issues](#reporting-issues)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Getting Started

Before you start contributing, please familiarize yourself with the project by reading the [README.md](../README.md). It provides an overview of what the tool does, how to install it, and its usage.

## Development Setup

To set up the development environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thenolle/create-nolly-template.git
   cd create-nolly-template
   ```

2. **Install dependencies:**
   This project uses [pnpm](https://pnpm.io/) for package management. If you don't have pnpm installed, install it first:
   ```bash
   npm install -g pnpm
   ```
   Then install the dependencies:
   ```bash
   pnpm install
   ```

3. **Run in development mode:**
   Use the dev script to run the CLI tool directly from source:
   ```bash
   pnpm dev
   ```
   This uses `tsx` to run TypeScript files without building.

4. **Build the project:**
   To build the distributable version:
   ```bash
   pnpm build
   ```
   This compiles TypeScript to JavaScript in the `dist/` folder.

5. **Test the built version:**
   After building, you can test the CLI:
   ```bash
   pnpm start
   ```

Ensure you have Node.js version 20 or higher installed, as specified in the `engines` field of `package.json`.

## Project Structure

- `src/`: Source code for the CLI tool
  - `index.ts`: Main entry point
  - `builder.ts`: Logic for building projects from templates
  - `paths.ts`: Path utilities
  - `registry/`: Template registry and types
- `templates/`: Template directories
  - `web/backend/fastify/`: Fastify-based backend templates
- `dist/`: Built JavaScript files (generated)
- `package.json`: Project configuration
- `tsconfig.json`: TypeScript configuration

## Adding New Templates

To add a new template:

1. Create a new directory under `templates/` following the structure (e.g., `templates/web/frontend/react/`).
2. Add the necessary files for the template (e.g., `package.json`, source files).
3. Update the registry in `src/registry/` to include the new template.
4. Test the template by running the CLI and selecting it.

Ensure templates are opinionated and follow best practices for the respective tech stack.

## Coding Guidelines

- **TypeScript:** All code is written in TypeScript. Use strict type checking.
- **Style:** Follow consistent naming conventions and formatting. Use Prettier if available (though not currently configured).
- **Commits:** Write clear, concise commit messages. Use conventional commits if possible (e.g., `feat: add new template`).
- **Imports:** Use ES modules (`import/export`) as the project is configured with `"type": "module"`.

## Testing

Currently, there are no automated tests set up. Contributions that add tests (e.g., using Jest or Vitest) are highly encouraged. For now, manually test your changes by:

- Running the CLI in dev mode
- Building and testing the built version
- Ensuring templates generate correctly

## Submitting Changes

1. **Fork the repository** on GitHub.
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit them:
   ```bash
   git commit -m "feat: description of your changes"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** on GitHub. Provide a clear description of what your changes do and why they're needed.

## Reporting Issues

If you find a bug or have a feature request:

1. Check the [existing issues](https://github.com/thenolle/create-nolly-template/issues) to see if it's already reported.
2. If not, open a new issue with:
   - A clear title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Your environment (Node.js version, OS, etc.)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Be respectful, inclusive, and constructive in all interactions.

## License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License as the project. See [LICENSE](../LICENSE) for details.

Thank you for contributing! 🚀
