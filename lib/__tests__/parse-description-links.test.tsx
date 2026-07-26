import { describe, it, expect } from '@jest/globals'
import { extractFirstDescriptionLink, parseDescriptionWithLinks } from '../parse-description-links'
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

  it('should parse Google Calendar HTML links', () => {
    const result = parseDescriptionWithLinks(
      'Sign up <a href="https://forms.gle/example?name=DUFC&amp;event=open">here</a><br>Bring kit'
    )
    const link = result.find(el => React.isValidElement(el) && el.type === 'a')

    expect(React.isValidElement(link) ? link.props.href : '').toBe(
      'https://forms.gle/example?name=DUFC&event=open'
    )
    expect(React.isValidElement(link) ? link.props.children : '').toBe('here')
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

  it('should preserve a markdown link that appears before an HTML link', () => {
    const result = parseDescriptionWithLinks(
      'Check [first](https://first.example) then <a href="https://second.example">second</a>'
    )
    const links = result.filter(el => React.isValidElement(el) && el.type === 'a')

    expect(React.isValidElement(links[0]) ? links[0].props.href : '').toBe('https://first.example')
    expect(React.isValidElement(links[1]) ? links[1].props.href : '').toBe('https://second.example')
  })
})

describe('extractFirstDescriptionLink', () => {
  it('should extract the href from a Google Calendar HTML link', () => {
    expect(
      extractFirstDescriptionLink('<a href="https://forms.gle/example">Register here</a>')
    ).toBe('https://forms.gle/example')
  })

  it('should not include trailing punctuation from a plain URL', () => {
    expect(extractFirstDescriptionLink('Register at https://example.com/register.')).toBe(
      'https://example.com/register'
    )
  })
})
