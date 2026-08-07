<div align="center">
  <img src="./public/logo.png" width="150" alt="TokenTrim Logo" />
  <h1>TokenTrim</h1>
  <p><strong>A lightning-fast, stateless web tool that optimizes LLM context windows by trimming ASTs and stripping function bodies to save tokens.</strong></p>
</div>

---

TokenTrim solves the problem of *token limits* and *context window* exhaustion by dissecting your source code's Abstract Syntax Tree (AST). It preserves critical definitions and architecture (like interfaces, types, class signatures, and function names) while stripping away the detailed logic inside function bodies.

## Key Features

- **Stateless & Secure**: Runs 100% locally in your browser using WebAssembly. Your source code is never sent to a server.
- **Tree-sitter Powered**: Understands the native structure of your code (not regex-based).
- **Multi-language Support**: Currently supports TypeScript, JavaScript, Python, Go, Rust, and Java.
- **Drag & Drop Folder**: Uses the `webkitdirectory` API to let you analyze hundreds of files at once from a single project folder.
- **Interactive Dashboard**: Select exactly which files to include/exclude with a checkbox-driven File Tree UI.
- **Token Estimator**: Measures in real-time the percentage of text and LLM tokens you are saving.
- **Markdown Ready**: The trimmed output is instantly merged into a Markdown format, ready to be copy-pasted into any AI prompt.

## Running the Project

This project is built using Next.js (App Router) and Tailwind CSS.

### Installation
```bash
npm install
```

### Starting the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing
This project adopts Test-Driven Development (TDD) using Vitest.
```bash
npm run test
```

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS & Framer Motion
- web-tree-sitter & WASM
- Vitest & React Testing Library

## Standards & Quality
This project maintains strict code quality using a combination of automated agents and patterns:
- **TDD Workflow**: A minimum standard of 80% test coverage.
- **Frontend Patterns**: A clean UI architecture separated from logic hooks (*Separation of Concerns*).
- **Security & Code Review**: Code is continuously verified against security vulnerabilities (OWASP) and modern coding best practices.
