# Quick Start Guide: Adding LinkedIn Posts

This guide will help you quickly add LinkedIn posts to Security Blog Search.

## Choose Your Method

### Method 1: Bookmarklet (Recommended) ⭐

**Best for:** Quick captures while browsing LinkedIn

1. **Install the bookmarklet** (one-time setup):
   - See [BOOKMARKLET.md](BOOKMARKLET.md) for installation
   - Drag the bookmark to your toolbar

2. **Use it**:
   - Navigate to a LinkedIn post
   - Click the bookmarklet
   - Review the auto-filled form
   - Add tags
   - Click "Generate Markdown"
   - Copy to clipboard

3. **Submit**:
   - Create file in `_linkedin_posts/YYYY-MM-DD-slug.md`
   - Paste content
   - Submit PR

### Method 2: Web Form 📝

**Best for:** Manual entry or when bookmarklet doesn't work

1. **Open** `linkedin-helper.html` in your browser
2. **Fill** the form with post details
3. **Generate** markdown
4. **Copy** to clipboard
5. **Create** file and submit PR

### Method 3: Manual ✍️

**Best for:** Advanced users or automation

1. Create file: `_linkedin_posts/YYYY-MM-DD-title.md`
2. Add front matter:

```yaml
---
layout: post
title: "Your Title"
author: "Author Name"
date: 2025-01-15
tags: [tag1, tag2]
link: "https://www.linkedin.com/posts/..."
summary: "Brief description"
---
```

3. Submit PR

## Example

Here's a complete example:

**Filename:** `_linkedin_posts/2025-01-15-entra-security-tips.md`

```yaml
---
layout: post
title: "5 Tips for Securing Microsoft Entra ID"
author: "Jane Smith"
date: 2025-01-15
tags: [entra-id, security, zero-trust, conditional-access]
link: "https://www.linkedin.com/posts/janesmith_entra-security-activity-123456"
summary: "Learn five essential security tips for Microsoft Entra ID including MFA, Conditional Access, and PIM best practices."
---
```

## Tips

- **Tags**: Use existing tags from [TAGGING_GUIDELINES.md](TAGGING_GUIDELINES.md)
- **Summary**: Keep it 2-3 sentences
- **Date**: Use the LinkedIn post publication date
- **Author**: Use the LinkedIn profile name

## Common Questions

**Q: What posts should I submit?**
A: Technical posts about security topics - tutorials, deep-dives, best practices

**Q: Can I submit my own posts?**
A: Yes! Share your security expertise with the community

**Q: How long does approval take?**
A: Usually reviewed within a few days by maintainers

## Need Help?

- Check [LINKEDIN_POSTS.md](LINKEDIN_POSTS.md) for detailed guide
- See sample posts in `_linkedin_posts/` directory
- Open an issue on GitHub

---

**Happy contributing! 🎉**
