import { describe, it, expect } from 'vitest'
import { cn } from '../../lib/utils'

describe('cn', () => {
  it('merges class names into a string', () => {
    const result = cn('foo', 'bar', { baz: true })
    expect(typeof result).toBe('string')
    expect(result.includes('foo')).toBe(true)
    expect(result.includes('bar')).toBe(true)
  })
})
