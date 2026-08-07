# LLM Context Optimizer & AST Trimmer

Sebuah aplikasi web *stateless* (sepenuhnya berjalan di browser) yang berfungsi untuk mengoptimalkan konteks kode sebelum dikirim ke Large Language Models (LLMs) seperti Claude, ChatGPT, atau Gemini. 

Sistem ini memecahkan masalah batasan *token limit* dan *context window* dengan membedah Abstract Syntax Tree (AST) kode sumber Anda, mempertahankan definisi dan arsitektur penting (seperti interface, tipe, signature class, & nama fungsi), sambil membuang logika detail di dalam *body* fungsi.

## Fitur Utama

- **Stateless & Secure**: Berjalan 100% secara lokal menggunakan kekuatan WebAssembly di browser Anda. Kode Anda tidak pernah dikirim ke server.
- **Tree-sitter Powered**: Memahami struktur asli kode (bukan Regex).
- **Multi-language Support**: Saat ini mendukung TypeScript, JavaScript, Python, Go, Rust, dan Java.
- **Drag & Drop Folder**: Gunakan API `webkitdirectory` untuk menganalisis dan memproses ratusan file sekaligus dari satu *folder* proyek.
- **File Tree UI**: Pilih secara spesifik file mana yang ingin Anda ikutkan/kecualikan dengan sistem *checkbox*.
- **Token Estimator**: Mengukur secara real-time seberapa banyak persentase teks dan token LLM yang berhasil Anda hemat.
- **Markdown Ready**: Hasil *trimming* langsung digabungkan ke format markdown sehingga siap di-*copy paste* ke prompt AI.

## Menjalankan Proyek

Proyek ini dibangun menggunakan Next.js dan Tailwind CSS.

### Instalasi
\`\`\`bash
npm install
\`\`\`

### Menjalankan Server Development
\`\`\`bash
npm run dev
\`\`\`
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### Testing
Proyek ini mengadopsi Test-Driven Development (TDD) menggunakan Vitest.
\`\`\`bash
npm run test
\`\`\`

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS & Framer Motion
- web-tree-sitter & WASM
- Vitest

## Standar & Kualitas
Proyek ini dijaga ketat kualitasnya menggunakan kombinasi *agen otomatis* yang melingkupi:
- **TDD Workflow**: Standar minimal 80% coverage.
- **Frontend Patterns**: Arsitektur UI yang dipisahkan dari Hook logika (*Separation of concerns*).
- **Security & Code Review**: Kode diverifikasi terhadap celah keamanan (OWASP) dan *best-practices* koding modern.
