/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../../components/ui/button'

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies the correct variant classes', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    // default variant has a background class
    expect(screen.getByRole('button')).toHaveClass('bg-background')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')

    rerender(<Button variant="ghost">Ghost</Button>)
    // ghost variant uses transparent bg and a hover primary background
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
    expect(screen.getByRole('button')).toHaveClass('hover:bg-primary/5')
  })

  it('applies the correct size classes', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    // default size in this project maps to h-16
    expect(screen.getByRole('button')).toHaveClass('h-16')

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-14')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})