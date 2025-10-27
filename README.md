# Security Blog Search

A community-driven Jekyll-based website for discovering and sharing security blog posts.

## About

Security Blog Search helps security professionals, researchers, and enthusiasts discover the best security blog posts from across the web. Users can search and filter posts by tags, author, date, and keywords.

## Features

- 🔍 **Search Functionality**: Search posts by title, author, tags, or summary
- 🏷️ **Filter by Tags**: Organize and discover posts by security topics
- 👤 **Filter by Author**: Find posts from specific authors
- 📅 **Sort by Date**: View newest or oldest posts first
- 📝 **Community-Driven**: Submit posts via pull request
- 🎨 **Clean Interface**: Easy-to-use, responsive design

## Local Development

### Prerequisites

- Ruby (version 2.7 or higher)
- Bundler gem

### Setup

1. Clone the repository:
```bash
git clone https://github.com/LouisMastelinck/securityblogsearch.com.git
cd securityblogsearch.com
```

2. Install dependencies:
```bash
bundle install
```

3. Run Jekyll locally:
```bash
bundle exec jekyll serve
```

4. Open your browser to `http://localhost:4000`

## Contributing

We welcome contributions! To submit a blog post:

1. Fork this repository
2. Create a new file in `_posts` directory with format: `YYYY-MM-DD-title-slug.md`
3. Add required front matter (see below)
4. Submit a pull request

**Note for External Contributors:** For security, external contributors can only modify files in the `_posts/` directory. Pull requests that modify other files (configuration, layouts, workflows, etc.) will be automatically blocked. See [.github/RULESETS.md](.github/RULESETS.md) for more information.

### Post Format

```yaml
---
layout: post
title: "Your Post Title"
author: "Your Name"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
link: "https://link-to-original-article.com"
summary: "A brief summary of the blog post"
---
```

See [CONTRIBUTING.md](contributing.md) for detailed guidelines.

## Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions. When changes are pushed to the `main` branch:

1. The GitHub Actions workflow (`.github/workflows/jekyll.yml`) is triggered
2. Jekyll builds the site with the appropriate base path
3. The built site is deployed to GitHub Pages

### Manual Deployment

You can also manually trigger a deployment from the Actions tab in the GitHub repository.

### GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. The site will be available at `https://securityblogsearch.com` (or your custom domain)

## Technology Stack

- **Jekyll**: Static site generator
- **HTML/CSS/JavaScript**: Frontend
- **GitHub Pages**: Hosting

## License

This project is open source and available under the MIT License.

## Contact

For questions or issues, please open an issue on [GitHub](https://github.com/LouisMastelinck/securityblogsearch.com/issues).