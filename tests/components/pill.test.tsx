/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pill } from '../../components/pill'

describe('Pill', () => {
  it('renders correctly with default props', () => {
    render(<Pill>Status</Pill>)
    const pill = screen.getByText('Status')
    expect(pill).toBeInTheDocument()
    // Pill uses inline-flex and font-mono by default
    expect(pill).toHaveClass('inline-flex')
    expect(pill).toHaveClass('font-mono')
  })

  it('applies custom className', () => {
    render(<Pill className="custom-class">Status</Pill>)
    const pill = screen.getByText('Status')
    expect(pill).toHaveClass('custom-class')
  })

  it('forwards additional props', () => {
    render(<Pill data-testid="test-pill">Status</Pill>)
    expect(screen.getByTestId('test-pill')).toBeInTheDocument()
  })
})