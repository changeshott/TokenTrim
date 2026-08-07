import type Parser from 'web-tree-sitter';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ParserClass: any;

let isInitialized = false;

export async function initParser() {
  if (!isInitialized) {
    if (!ParserClass) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      ParserClass = require('web-tree-sitter');
      // If it exports default, use it
      if (ParserClass.default) ParserClass = ParserClass.default;
    }
    await ParserClass.init({
      locateFile: (path: string, prefix: string) => {
        if (path === 'tree-sitter.wasm') {
          return 'https://unpkg.com/web-tree-sitter@0.22.6/tree-sitter.wasm';
        }
        return prefix + path;
      },
    });
    isInitialized = true;
  }
}

export async function getLanguage(langName: string): Promise<Parser.Language> {
  const url = `https://unpkg.com/tree-sitter-wasms@0.1.11/out/tree-sitter-${langName}.wasm`;
  return await ParserClass.Language.load(url);
}

export function detectLanguage(filename: string): string | null {
  if (/\.(ts|tsx|js|jsx)$/i.test(filename)) {
    return 'tsx';
  } else if (/\.(py)$/i.test(filename)) {
    return 'python';
  } else if (/\.(go)$/i.test(filename)) {
    return 'go';
  } else if (/\.(rs)$/i.test(filename)) {
    return 'rust';
  } else if (/\.(java)$/i.test(filename)) {
    return 'java';
  }
  return null;
}

export async function parseCode(code: string, languageName: string): Promise<Parser.Tree> {
  await initParser();
  const parser = new ParserClass();
  const lang = await getLanguage(languageName);
  parser.setLanguage(lang);
  return parser.parse(code);
}
