import { describe, it, expect } from '@jest/globals'
import { parseDescriptionWithLinks } from '../parse-description-links'
import React from 'react'

describe('parseDescriptionWithLinks', () => {
  it('should handle plain text without links', () => {
    const result = parseDescriptionWithLinks('This is a simple description')
    expect(result).toHaveLength(1)
  })

  it('should parse markdown-style links', () => {
    const result = parseDescriptionWithLinks('Check out [our website](https://example.com) for more info')
    expect(result).toHaveLength(3)
    // Should have: text before, link, text after
  })

  it('should parse plain URLs', () => {
    const result = parseDescriptionWithLinks('Visit https://example.com for details')
    expect(result).toHaveLength(3)
    // Should have: text before, link, text after
  })

  it('should handle multiple links', () => {
    const result = parseDescriptionWithLinks(
      'Visit [site1](https://example1.com) and [site2](https://example2.com)'
    )
    expect(result.length).toBeGreaterThan(3)
  })

  it('should remove Tag: prefix', () => {
    const result = parseDescriptionWithLinks('Tag: Competition\nThis is the description')
    const textContent = result.map(el => {
      if (React.isValidElement(el) && el.type === 'span') {
        return el.props.children
      }
      return ''
    }).join('')
    expect(textContent).not.toContain('Tag: Competition')
  })

  it('should handle mixed markdown and plain URLs', () => {
    const result = parseDescriptionWithLinks(
      'Check [this link](https://example.com) and also https://another.com'
    )
    expect(result.length).toBeGreaterThan(3)
  })
})
