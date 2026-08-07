import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from './page'

// Mock framer motion to prevent IntersectionObserver issues in jsdom
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: {
      div: 'div',
      h1: 'h1',
      p: 'p',
    }
  }
})

describe('Landing Page', () => {
  it('renders the main hero content', () => {
    render(<Home />)
    
    expect(screen.getByText(/Optimize LLM Context Window/i)).toBeInTheDocument()
    expect(screen.getByText(/Shrink Code/i)).toBeInTheDocument()
    expect(screen.getByText(/Intelligently trim your AST/i)).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<Home />)
    
    expect(screen.getByText(/Lightning Fast Processing/i)).toBeInTheDocument()
    expect(screen.getByText(/100% Local & Secure/i)).toBeInTheDocument()
    expect(screen.getByText(/Token Optimization/i)).toBeInTheDocument()
  })

  it('contains a link to the dashboard', () => {
    render(<Home />)
    
    const cta = screen.getByText(/Get Started Free/i)
    expect(cta).toBeInTheDocument()
    expect(cta.closest('a')).toHaveAttribute('href', '/dashboard')
  })
})
