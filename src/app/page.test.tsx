import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from './page'

// Mock framer motion as a Proxy so that any motion.tag renders as the tag name
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: new Proxy({}, {
      get: (target, prop) => {
        return prop;
      }
    })
  }
})

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}))

describe('Landing Page Redesign', () => {
  it('renders the main grid elements', () => {
    render(<Home />)
    
    expect(screen.getByText(/TOKENTRIM.APP/i)).toBeInTheDocument()
    expect(screen.getByText(/Optimize &/i)).toBeInTheDocument()
    expect(screen.getByText(/Thinking in tokens/i)).toBeInTheDocument()
  })

  it('renders the massive headline', () => {
    render(<Home />)
    
    expect(screen.getByText(/WE BRING/i)).toBeInTheDocument()
    expect(screen.getByText(/CLARITY & CONTEXT/i)).toBeInTheDocument()
  })

  it('contains a launch app link', () => {
    render(<Home />)
    
    const cta = screen.getByText(/LAUNCH APP/i)
    expect(cta).toBeInTheDocument()
    expect(cta.closest('a')).toHaveAttribute('href', '/dashboard')
  })
})
