/* eslint-disable @typescript-eslint/no-explicit-any */
import type Parser from 'web-tree-sitter';

interface Edit {
  startIndex: number;
  endIndex: number;
  replacement: string;
}

export function trimCode(code: string, tree: Parser.Tree, languageName: string): string {
  const edits: Edit[] = [];
  
  function traverse(node: any) {
    if (languageName === 'tsx') {
      if (['function_declaration', 'method_definition', 'arrow_function'].includes(node.type)) {
        const block = node.children.find((c: any) => c.type === 'statement_block');
        if (block) {
          edits.push({
            startIndex: block.startIndex,
            endIndex: block.endIndex,
            replacement: '{ /* implementation elided */ }'
          });
          return; // don't traverse into the block
        }
      }
    } else if (languageName === 'python') {
      if (node.type === 'function_definition') {
        const block = node.children.find((c: any) => c.type === 'block');
        if (block) {
          edits.push({
            startIndex: block.startIndex,
            endIndex: block.endIndex,
            replacement: 'pass # implementation elided'
          });
          return;
        }
      }
    } else if (languageName === 'go') {
      if (['function_declaration', 'method_declaration'].includes(node.type)) {
        const block = node.children.find((c: any) => c.type === 'block');
        if (block) {
          edits.push({
            startIndex: block.startIndex,
            endIndex: block.endIndex,
            replacement: '{ /* implementation elided */ }'
          });
          return;
        }
      }
    } else if (languageName === 'rust') {
      if (['function_item', 'method_item'].includes(node.type) || node.type === 'impl_item') {
        const block = node.children.find((c: any) => c.type === 'block');
        if (block) {
          edits.push({
            startIndex: block.startIndex,
            endIndex: block.endIndex,
            replacement: '{ /* implementation elided */ }'
          });
          return;
        }
      }
    } else if (languageName === 'java') {
      if (['method_declaration', 'constructor_declaration'].includes(node.type)) {
        const block = node.children.find((c: any) => c.type === 'block');
        if (block) {
          edits.push({
            startIndex: block.startIndex,
            endIndex: block.endIndex,
            replacement: '{ /* implementation elided */ }'
          });
          return;
        }
      }
    }
    
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(tree.rootNode);

  // Sort edits in descending order of startIndex so replacing doesn't mess up earlier indices
  edits.sort((a, b) => b.startIndex - a.startIndex);

  let result = code;
  for (const edit of edits) {
    result = result.slice(0, edit.startIndex) + edit.replacement + result.slice(edit.endIndex);
  }

  return result;
}
