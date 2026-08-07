export interface ProcessedFile {
  filename: string;
  trimmedContent: string;
  language: string;
}

export function formatOutput(files: ProcessedFile[]): string {
  let output = '';
  
  for (const file of files) {
    const extMap: Record<string, string> = {
      tsx: 'typescript',
      python: 'python',
      go: 'go'
    };
    const mdLang = extMap[file.language] || '';
    
    output += `### ${file.filename}\n\n`;
    output += `\`\`\`${mdLang}\n`;
    output += file.trimmedContent;
    if (!file.trimmedContent.endsWith('\n')) {
      output += '\n';
    }
    output += `\`\`\`\n\n`;
  }
  
  return output.trim();
}
