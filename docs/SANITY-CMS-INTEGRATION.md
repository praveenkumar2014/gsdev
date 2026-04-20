# Sanity CMS Integration Guide

## Overview

This guide explains how to integrate Sanity CMS into GSDEV for content management.

## Prerequisites

- Sanity account: https://www.sanity.io/
- Sanity CLI installed: `npm install -g @sanity/cli`
- GSDEV project directory

## Installation

### 1. Install Sanity SDK

```bash
cd /Users/mac/1codetogs/1code
npm install next-sanity @sanity/image-url
```

### 2. Initialize Sanity Project

```bash
npx create-sanity@latest
```

Follow the prompts to configure:
- Project name: `gsdev-cms`
- Use dataset: `production`
- Template: Clean project with no predefined schemas

### 3. Configure Environment Variables

Add to `.env` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_TOKEN=your-api-token
```

## Schema Configuration

### Create Content Models

Create schemas in `sanity/schema/index.ts`:

```typescript
import { defineType, defineField } from '@sanity-typed/types'

export const Post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})

export const Author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      type: 'text',
    }),
    defineField({
      name: 'avatar',
      type: 'image',
    }),
    defineField({
      name: 'social',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          type: 'string',
        }),
        defineField({
          name: 'github',
          type: 'string',
        }),
      ],
    }),
  ],
})

export const Page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => 'Rule.required()',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'seo',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          type: 'text',
        }),
        defineField({
          name: 'image',
          type: 'image',
        }),
      ],
    }),
  ],
})
```

## Client Setup

### Create Sanity Client

Create `src/renderer/lib/sanity-client.ts`:

```typescript
import { createClient } from 'next-sanity'
import { imageUrlBuilder } from '@sanity/image-url'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
}

export const client = createClient(config)

export const urlFor = (source: string) => imageUrlBuilder(source).config(config)

export async function getPosts() {
  return await client.fetch(
    `*[_type == "post"] | order(publishedAt desc)`
  )
}

export async function getPostBySlug(slug: string) {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { params: { slug } }
  )
}

export async function getPage(slug: string) {
  return await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { params: { slug } }
  )
}
```

## Integration in Components

### Content Fetching Component

```typescript
import { getPosts, getPostBySlug } from '@/lib/sanity-client'

export async function BlogPage() {
  const posts = await getPosts()
  
  return (
    <div>
      <h1>Blog</h1>
      {posts.map((post) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.publishedAt}</p>
        </article>
      ))}
    </div>
  )
}
```

## Usage in GSDEV

### Documentation Pages

Use Sanity for:
- Feature documentation
- API documentation
- Blog posts
- Release notes
- User guides

### Dynamic Content

Fetch content dynamically:
- Landing page hero text
- Feature descriptions
- Pricing information
- Announcements

### Content Management

1. **Access Sanity Studio**: https://www.sanity.io/studio
2. **Edit Content**: Use visual editor for rich text
3. **Publish**: Publish changes to production
4. **Auto-Update**: Content updates in real-time

## Deployment

### Production

1. Set environment variables in production
2. Deploy Sanity content
3. Configure CORS in Sanity dashboard
4. Test content fetching

### Development

Use Sanity CLI for local development:
```bash
npx sanity dev
```

## Best Practices

- Use type-safe schemas
- Implement content validation
- Optimize image loading
- Cache content appropriately
- Handle loading states
- Error handling for API failures

## Support

- Sanity Documentation: https://www.sanity.io/docs
- GSDEV Support: support@gsdev.dev
