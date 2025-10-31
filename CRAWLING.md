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
    rss_feed: https://example.com/feed/  # Optional - will auto-detect if omitted
```

### Configuration Options

- **url** (required): The base URL of the website
- **rss_feed** (optional): Direct URL to RSS/Atom feed. If not provided, the crawler will attempt to auto-detect the feed URL
- **author** (optional): Default author name for posts from this site. If not provided, the crawler will extract the author from the RSS feed entries
- **tags** (optional): List of default tags to apply to posts from this site. If not provided, the crawler will extract tags from the RSS feed categories or infer them from the post content

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

### Content Enrichment

The crawler automatically enriches posts with metadata from the RSS feed:

1. **Author Extraction**: Attempts to extract author information from RSS feed entries (author field, dc:creator, etc.). If no author is found in the feed and none is specified in the config, defaults to "Unknown"
2. **Tag Extraction**: Extracts tags from:
   - RSS feed categories and tags
   - Content analysis (keywords like azure, entra-id, security, defender, etc.)
   - Defaults to ['security'] if no tags can be determined
3. **Summary Generation**: Creates meaningful summaries for each post:
   - First tries to use the summary/description from the RSS feed
   - If RSS summary is missing or too short (< 50 characters), fetches the actual blog post and extracts:
     - Meta description from the page
     - First substantial paragraph from the article
   - Ensures all posts have relevant, descriptive summaries

This allows you to simply provide the website URL and RSS feed, and the crawler will automatically populate author, tags, and summaries based on the crawled content.

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

## Configuration Validation

To ensure the `websites.yml` file is properly formatted, a validation script is available:

```bash
python3 .github/scripts/validate_websites_yml.py websites.yml
```

This validation is automatically run:
- Before each crawler run
- On pull requests that modify `websites.yml`
- On pushes to the main branch

The validator checks for:
- Valid YAML syntax
- Required fields (url)
- Proper data types for all fields
- Common configuration mistakes

## Files

- `.github/workflows/crawl-blogs.yml` - GitHub Actions workflow for crawling
- `.github/workflows/validate-config.yml` - GitHub Actions workflow for validation
- `.github/scripts/crawl_blogs.py` - Python crawler script
- `.github/scripts/validate_websites_yml.py` - Configuration validation script
- `.github/scripts/test_crawler.py` - Unit tests for crawler functionality
- `websites.yml` - Website configuration

## Requirements

The crawler requires these Python packages (automatically installed by the workflow):
- PyYAML
- feedparser
- requests
- beautifulsoup4
