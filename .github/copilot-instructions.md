<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Nonogram React Project Instructions

## Project Objective

Develop a modular, scalable Nonogram puzzle game using React 18+, Vite, and React Router. The project must preserve all original game logic and interface, focusing on clean code and best practices, and be ready for deployment on Vercel.

## Visual Style Consistency

- Always maintain a consistent visual style throughout the project.
- When creating or updating components, base all styling (colors, fonts, spacing, borders, etc.) on the existing styles and color palette already defined in the project.
- Avoid introducing new colors, fonts, or style patterns unless absolutely necessary and justified for UX.
- Use CSS Modules and follow the established naming conventions for classes.
- Ensure that new UI elements blend seamlessly with the current design.

## Communication

- All code, comments, and documentation in English.
- All communication with the developer in Portuguese (pt-BR).

## Naming and Terminology

- Use English for all variable, function, and component names (camelCase).

## Code Architecture & Clean Code Practices

- Use CSS Modules for component styling to avoid conflicts and ensure maintainability.
- Create reusable, single-responsibility components and custom hooks for complex logic.
- Use clear, descriptive names for variables, functions, and components.
- Write professional comments explaining what and why (never who), focusing on logic and decisions.
- Avoid code duplication and unnecessary complexity.
- Use semantic HTML elements and React best practices (functional components, hooks, state management).
- Implement proper TypeScript types if using TypeScript.

## Integration and Deployment (Vercel)

- The project must be compatible with static deployment on Vercel (https://vercel.com), a platform for hosting modern front-end applications.
- All assets and puzzles must be inside the `public` folder.
- Use React Router in a way that supports static hosting (e.g., browser history fallback).
- Avoid dependencies that require server-side routing or files outside `public`.
- Prepare for automatic build and deploy workflows.

## Future-Proofing & Commercial Architecture

- Design the codebase to easily add features like timer, scoring, themes, and settings.
- Keep components modular and loosely coupled for scalability and maintainability.
- Prepare for mobile/touch optimization.
- Structure code for future API integration and backend compatibility.
- Implement scalable state management for future user features.

## Comment Guidelines

**DO:**
- `// Calculate minimum space required for clues`
- `// Handle cell click interaction`
- `// Validate puzzle solution`

**DON'T:**
- `// This code was fixed`
- `// Updated by AI`
- `// Generated code`
- `// Copilot suggestion`
- `// Modified version`
