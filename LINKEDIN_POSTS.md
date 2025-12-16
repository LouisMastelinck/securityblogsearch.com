# Adding LinkedIn Posts

This guide explains how to add LinkedIn posts to the security blog search.

## Manual Method

To manually add a LinkedIn post:

1. Create a new file in the `_linkedin_posts` directory with the format: `YYYY-MM-DD-title-slug.md`
2. Add the required front matter:

```yaml
---
layout: post
title: "Your Post Title"
author: "Author Name"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
link: "https://www.linkedin.com/posts/username-post-url"
summary: "A brief summary of the LinkedIn post"
---
```

3. Submit a pull request with your new LinkedIn post

## Guidelines

- **Title**: Use a descriptive title that captures the main topic
- **Author**: Use the LinkedIn profile name of the post author
- **Date**: Use the publication date from LinkedIn
- **Tags**: Follow the [tagging guidelines](TAGGING_GUIDELINES.md)
- **Link**: Use the full LinkedIn post URL
- **Summary**: Write a concise summary (2-3 sentences) of the post content

## LinkedIn Post Types

LinkedIn posts that are good candidates for inclusion:
- Technical deep-dives on security topics
- How-to guides and tutorials
- Security announcements and updates
- Best practices and lessons learned
- Tool reviews and comparisons

## Finding LinkedIn Post URLs

To get the LinkedIn post URL:
1. Navigate to the LinkedIn post
2. Click the "..." menu on the post
3. Select "Copy link to post"
4. Use this URL in the `link` field

## API Integration (Future)

LinkedIn's official API has limitations for accessing public posts. Currently, manual submission is the recommended method. 

### LinkedIn API Limitations

The LinkedIn API requires:
- OAuth 2.0 authentication
- Approved developer application
- Limited access to post data (mainly for authenticated users' own content)
- Cannot easily crawl public posts from other users

### Alternative Approaches

For easier LinkedIn post submission in the future, we could consider:

1. **Browser Extension**: A simple Chrome/Firefox extension to capture post metadata while browsing LinkedIn
2. **Bookmarklet**: A bookmark that captures the current LinkedIn post and formats it for submission
3. **Form-based Submission**: A web form where users paste LinkedIn URLs and the system extracts metadata
4. **RSS-to-LinkedIn**: Monitor LinkedIn profile RSS feeds (if available for specific profiles)

## Example

Here's an example LinkedIn post entry:

```yaml
---
layout: post
title: "Implementing Zero Trust with Microsoft Defender"
author: "Jane Smith"
date: 2025-01-10
tags: [zero-trust, defender-for-endpoint, security]
link: "https://www.linkedin.com/posts/janesmith_zerotrust-microsoftdefender-activity-7890123456"
summary: "Learn how to implement Zero Trust architecture using Microsoft Defender for Endpoint, including practical steps and real-world examples."
---
```

## Contributing

When submitting LinkedIn posts:
- Ensure the content is security-related
- Verify all links are working
- Use consistent formatting
- Follow the tagging standards
- Only submit posts you have permission to share

For questions, please open an issue on the GitHub repository.
