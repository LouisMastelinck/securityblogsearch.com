# Automated Blog Crawling

This repository includes an automated blog crawler that runs every hour to discover new security blog posts from configured websites.

## How It Works

1. **Configuration**: Websites are configured in `websites.yml` at the root of the repository
2. **Scheduled Runs**: A GitHub Actions workflow runs every hour to check for new posts
3. **RSS/Atom Feeds**: The crawler uses RSS/Atom feeds to discover new blog posts
4. **Duplicate Detection**: Posts are checked against existing links to avoid duplicates
5. **Pull Requests**: When new posts are found, an automated PR is created with the new content

## Adding a Website to Crawl

To add a new website to the crawler, edit the `websites.yml` file:

```yaml
websites:
  - url: https://example.com
    author: "Author Name"
    tags: [security, tag2, tag3]
    rss_feed: https://example.com/feed/  # Optional - will auto-detect if omitted
```

### Configuration Options

- **url** (required): The base URL of the website
- **author** (required): Default author name for posts from this site
- **tags** (required): List of tags to apply to posts from this site
- **rss_feed** (optional): Direct URL to RSS/Atom feed. If not provided, the crawler will attempt to auto-detect the feed URL

## Manual Triggering

You can manually trigger the crawler workflow:

1. Go to the **Actions** tab in GitHub
2. Select **Crawl Blogs and Create PR** workflow
3. Click **Run workflow**
4. Click the green **Run workflow** button

## How the Crawler Works

### Feed Discovery

If no RSS feed is specified, the crawler attempts to auto-detect feeds by:
1. Parsing the website's HTML for `<link>` tags with RSS/Atom types
2. Trying common feed paths like `/feed/`, `/rss/`, `/atom.xml`, etc.

### Post Format

New posts are created in the `_posts` directory following this format:

```markdown
---
layout: post
title: "Post Title"
author: "Author Name"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
link: "https://original-post-url.com"
summary: "Brief summary of the post"
---
```

### Duplicate Prevention

The crawler maintains a list of all existing post URLs and will not create duplicate entries. Posts are identified uniquely by their `link` field.

## Reviewing Automated PRs

When new posts are discovered, a pull request is automatically created with:
- A descriptive title: "🤖 New Blog Posts Discovered"
- Details about the discovered posts
- Labels: `automated`, `new-content`
- Assignment to the repository owner

Review the PR to:
- Verify post titles are accurate
- Check that summaries are appropriate
- Ensure links are correct
- Confirm tags are relevant

## Troubleshooting

### No posts are being discovered

- Verify the RSS feed URL is correct
- Check if the website actually has an RSS/Atom feed
- Ensure the feed is publicly accessible
- Review the workflow logs in GitHub Actions

### Duplicate posts are created

- This should not happen due to URL-based duplicate detection
- If it does occur, the existing posts may have malformed `link` fields
- Check that all existing posts have valid `link:` entries in their front matter

### Posts have incorrect formatting

- The crawler follows the format of existing posts in `_posts`
- If formatting issues occur, they should be fixed in the automated PR before merging
- Consider updating the crawler script if systematic issues are found

## Files

- `.github/workflows/crawl-blogs.yml` - GitHub Actions workflow
- `.github/scripts/crawl_blogs.py` - Python crawler script
- `websites.yml` - Website configuration

## Requirements

The crawler requires these Python packages (automatically installed by the workflow):
- PyYAML
- feedparser
- requests
- beautifulsoup4
