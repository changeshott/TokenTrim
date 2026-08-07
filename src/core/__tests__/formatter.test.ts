import { describe, it, expect } from 'vitest';
import { formatOutput, ProcessedFile } from '../formatter';

describe('Formatter', () => {
  it('should format output correctly for different languages', () => {
    const files: ProcessedFile[] = [
      { filename: 'app.ts', trimmedContent: 'const a = 1;', language: 'tsx' },
      { filename: 'main.py', trimmedContent: 'print("Hello")', language: 'python' }
    ];

    const output = formatOutput(files);

    expect(output).toContain('### app.ts');
    expect(output).toContain('```typescript\nconst a = 1;\n```');
    expect(output).toContain('### main.py');
    expect(output).toContain('```python\nprint("Hello")\n```');
  });

  it('should handle empty files', () => {
    const files: ProcessedFile[] = [];
    const output = formatOutput(files);
    expect(output).toBe('');
  });
});
