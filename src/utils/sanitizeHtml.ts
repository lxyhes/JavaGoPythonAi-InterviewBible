export type SanitizeProfile = 'default' | 'markdown' | 'section'

const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'svg',
  'math',
])

const PROFILE_ALLOWED_TAGS: Record<SanitizeProfile, Set<string>> = {
  default: new Set([
    'a',
    'blockquote',
    'br',
    'code',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'hr',
    'i',
    'li',
    'ol',
    'p',
    'pre',
    's',
    'span',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ]),
  markdown: new Set([
    'a',
    'blockquote',
    'br',
    'code',
    'em',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'ul',
  ]),
  section: new Set([
    'a',
    'blockquote',
    'br',
    'code',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'hr',
    'i',
    'li',
    'ol',
    'p',
    'pre',
    's',
    'span',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ]),
}

const GLOBAL_ALLOWED_ATTRS = new Set(['class', 'id', 'title'])
const LINK_ALLOWED_ATTRS = new Set(['href', 'target', 'rel'])
const CELL_ALLOWED_ATTRS = new Set(['colspan', 'rowspan'])

const isSafeHref = (href: string) => {
  const value = href.trim().toLowerCase()
  if (!value) return false
  if (value.startsWith('#') || value.startsWith('/')) return true

  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('mailto:') || value.startsWith('tel:')
}

const sanitizeElement = (element: Element, allowedTags: Set<string>) => {
  const children = Array.from(element.children)
  children.forEach((child) => sanitizeElement(child, allowedTags))

  const tagName = element.tagName.toLowerCase()

  if (BLOCKED_TAGS.has(tagName)) {
    element.remove()
    return
  }

  if (!allowedTags.has(tagName)) {
    element.replaceWith(...Array.from(element.childNodes))
    return
  }

  const attrs = Array.from(element.attributes)
  attrs.forEach((attr) => {
    const name = attr.name.toLowerCase()
    const value = attr.value

    if (name.startsWith('on') || name === 'style' || name === 'srcdoc') {
      element.removeAttribute(attr.name)
      return
    }

    if (GLOBAL_ALLOWED_ATTRS.has(name)) {
      return
    }

    if (tagName === 'a' && LINK_ALLOWED_ATTRS.has(name)) {
      if (name === 'href' && !isSafeHref(value)) {
        element.removeAttribute('href')
      }
      return
    }

    if ((tagName === 'td' || tagName === 'th') && CELL_ALLOWED_ATTRS.has(name)) {
      return
    }

    element.removeAttribute(attr.name)
  })

  if (tagName === 'a') {
    const target = element.getAttribute('target')
    if (target === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer')
    }
  }
}

export const sanitizeHtml = (rawHtml: string, profile: SanitizeProfile = 'default') => {
  if (typeof window === 'undefined') {
    return ''
  }

  const allowedTags = PROFILE_ALLOWED_TAGS[profile]
  const template = document.createElement('template')
  template.innerHTML = rawHtml

  Array.from(template.content.children).forEach((child) => sanitizeElement(child, allowedTags))

  return template.innerHTML
}
