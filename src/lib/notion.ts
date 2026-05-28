// src/lib/notion.ts
// Notion CMS client for CosmetCheck blog
// Fetches blog posts from a Notion Database at build time

import { Client } from '@notionhq/client'
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { BlogPost, BlogLocale } from './blog-data'

// ── Client ────────────────────────────────────────────────────

const notionToken = process.env.NOTION_TOKEN
const blogDatabaseId = process.env.NOTION_BLOG_DATABASE_ID

function getNotionClient(): Client | null {
  if (!notionToken) {
    console.warn('[Notion] NOTION_TOKEN not set, skipping Notion CMS')
    return null
  }
  return new Client({ auth: notionToken })
}

// ── Rich Text → HTML ──────────────────────────────────────────

function richTextToHtml(richText: RichTextItemResponse[]): string {
  return richText
    .map((rt) => {
      let text = escapeHtml(rt.plain_text)
      if (rt.annotations.bold) text = `<strong>${text}</strong>`
      if (rt.annotations.italic) text = `<em>${text}</em>`
      if (rt.annotations.strikethrough) text = `<s>${text}</s>`
      if (rt.annotations.underline) text = `<u>${text}</u>`
      if (rt.annotations.code) text = `<code>${text}</code>`
      if (rt.href) text = `<a href="${rt.href}">${text}</a>`
      return text
    })
    .join('')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ── Block → HTML ──────────────────────────────────────────────

export async function blocksToHtml(
  notion: Client,
  blockId: string
): Promise<string> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    })
    blocks.push(...(response.results as BlockObjectResponse[]))
    cursor = response.next_cursor ?? undefined
  } while (cursor)

  return renderBlocks(blocks)
}

function renderBlocks(blocks: BlockObjectResponse[]): string {
  const html: string[] = []
  let inBulletedList = false
  let inNumberedList = false

  const closeList = () => {
    if (inBulletedList) {
      html.push('</ul>')
      inBulletedList = false
    }
    if (inNumberedList) {
      html.push('</ol>')
      inNumberedList = false
    }
  }

  for (const block of blocks) {
    const type = block.type

    switch (type) {
      case 'paragraph': {
        closeList()
        const text = richTextToHtml(block.paragraph.rich_text)
        html.push(text ? `<p>${text}</p>` : '<p><br></p>')
        break
      }
      case 'heading_1': {
        closeList()
        html.push(`<h2>${richTextToHtml(block.heading_1.rich_text)}</h2>`)
        break
      }
      case 'heading_2': {
        closeList()
        html.push(`<h3>${richTextToHtml(block.heading_2.rich_text)}</h3>`)
        break
      }
      case 'heading_3': {
        closeList()
        html.push(`<h4>${richTextToHtml(block.heading_3.rich_text)}</h4>`)
        break
      }
      case 'bulleted_list_item': {
        if (!inBulletedList) {
          closeList()
          html.push('<ul>')
          inBulletedList = true
        }
        html.push(`<li>${richTextToHtml(block.bulleted_list_item.rich_text)}</li>`)
        break
      }
      case 'numbered_list_item': {
        if (!inNumberedList) {
          closeList()
          html.push('<ol>')
          inNumberedList = true
        }
        html.push(`<li>${richTextToHtml(block.numbered_list_item.rich_text)}</li>`)
        break
      }
      case 'quote': {
        closeList()
        html.push(`<blockquote>${richTextToHtml(block.quote.rich_text)}</blockquote>`)
        break
      }
      case 'divider': {
        closeList()
        html.push('<hr>')
        break
      }
      case 'image': {
        closeList()
        const src =
          block.image.type === 'external'
            ? block.image.external.url
            : block.image.file?.url ?? ''
        const caption = richTextToHtml(block.image.caption)
        html.push(
          `<figure><img src="${src}" alt="${caption}" loading="lazy" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
        )
        break
      }
      case 'callout': {
        closeList()
        const text = richTextToHtml(block.callout.rich_text)
        html.push(`<div class="notion-callout">${text}</div>`)
        break
      }
      case 'toggle': {
        closeList()
        const title = richTextToHtml(block.toggle.rich_text)
        html.push(`<details><summary>${title}</summary>`)
        // Toggle children not fetched for simplicity
        html.push('</details>')
        break
      }
      default:
        closeList()
        // Skip unsupported blocks
        break
    }
  }

  closeList()
  return html.join('\n')
}

// ── Database → BlogPost ───────────────────────────────────────

function getProperty(
  page: PageObjectResponse,
  key: string
): string | boolean | number | string[] | null {
  const prop = page.properties[key]
  if (!prop) return null

  switch (prop.type) {
    case 'title':
      return prop.title.map((t) => t.plain_text).join('') || null
    case 'rich_text':
      return prop.rich_text.map((t) => t.plain_text).join('') || null
    case 'select':
      return prop.select?.name ?? null
    case 'multi_select':
      return prop.multi_select.map((s) => s.name)
    case 'checkbox':
      return prop.checkbox
    case 'number':
      return prop.number
    case 'date':
      return prop.date?.start ?? null
    default:
      return null
  }
}

function getString(page: PageObjectResponse, key: string): string {
  const val = getProperty(page, key)
  return typeof val === 'string' ? val : ''
}

function getStringArray(page: PageObjectResponse, key: string): string[] {
  const val = getProperty(page, key)
  return Array.isArray(val) ? val : []
}

function getBoolean(page: PageObjectResponse, key: string): boolean {
  const val = getProperty(page, key)
  return typeof val === 'boolean' ? val : false
}

function getNumber(page: PageObjectResponse, key: string): number {
  const val = getProperty(page, key)
  return typeof val === 'number' ? val : 0
}

// ── Public API ────────────────────────────────────────────────

/**
 * Fetch all published blog posts from Notion Database.
 * Returns empty array if Notion is not configured.
 */
export async function fetchBlogPostsFromNotion(): Promise<BlogPost[]> {
  const notion = getNotionClient()
  if (!notion || !blogDatabaseId) {
    return []
  }

  const pages: PageObjectResponse[] = []
  let cursor: string | undefined

  do {
    // @ts-expect-error - notion client type issue
    const response = await notion.databases.query({
      database_id: blogDatabaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
      start_cursor: cursor,
    })
    pages.push(...(response.results as PageObjectResponse[]))
    cursor = response.next_cursor ?? undefined
  } while (cursor)

  const posts: BlogPost[] = []

  for (const page of pages) {
    const slug = getString(page, 'Slug')
    if (!slug) continue

    const locale = getString(page, 'Locale') as BlogLocale
    if (!['pt-BR', 'es-MX', 'en'].includes(locale)) continue

    const content = await blocksToHtml(notion, page.id)
    const date = getString(page, 'Date') || new Date().toISOString().split('T')[0]

    posts.push({
      slug,
      title: getString(page, 'Title') || slug,
      excerpt: getString(page, 'Excerpt'),
      content,
      locale,
      category: getString(page, 'Category') || 'Blog',
      author: getString(page, 'Author') || 'CosmetCheck Team',
      publishedAt: date,
      updatedAt: getString(page, 'Updated') || date,
      tags: getStringArray(page, 'Tags'),
      targetKeyword: getString(page, 'Target Keyword'),
      readingTime: getNumber(page, 'Reading Time') || Math.max(1, Math.round(content.length / 2000)),
      featured: getBoolean(page, 'Featured'),
    })
  }

  return posts
}

/**
 * Check if Notion CMS is configured.
 */
export function isNotionConfigured(): boolean {
  return Boolean(notionToken && blogDatabaseId)
}
