import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Dashboard from './page'

// Mock hooks and components
vi.mock('@/hooks/useAstTrimmer', () => ({
  useAstTrimmer: () => ({
    processFiles: vi.fn(),
    isProcessing: false,
    progress: { current: 0, total: 0, currentFile: '' },
    files: [],
    error: null,
    reset: vi.fn(),
    toggleFile: vi.fn(),
    toggleAll: vi.fn(),
  })
}))

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: {
      div: 'div',
      h1: 'h1',
      p: 'p',
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
  }
})

describe('Dashboard Page', () => {
  it('renders the initial state with folder upload', () => {
    render(<Dashboard />)
    
    expect(screen.getByText(/Workspace/i)).toBeInTheDocument()
    expect(screen.getByText(/Select Project Folder/i)).toBeInTheDocument()
    expect(screen.getByText(/Supports .ts, .py, .go, .rs, .java files/i)).toBeInTheDocument()
  })
})
