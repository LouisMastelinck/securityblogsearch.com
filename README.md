# Security Blog Search

> 🔍 **A curated, searchable directory of security blog posts from across the web**

This repository powers [securityblogsearch.com](https://securityblogsearch.com) - a community-driven platform that helps security professionals discover high-quality security content.

## 🎯 What is This Repository?

This is a **content repository** where the security community collectively curates and shares links to valuable security blog posts. Each post submission is a simple markdown file containing metadata about an external blog post (title, author, tags, link, and summary).

**This repository is NOT:**
- A place to host full blog post content
- A blogging platform
- Just website code

**This repository IS:**
- A curated index of security blog posts from across the internet
- A community effort to make security knowledge more discoverable
- Open for contributions from anyone in the security community

## ✨ Features

The website provides:

- 🔍 **Powerful Search**: Find posts by title, author, tags, or keywords
- 🏷️ **Tag-Based Filtering**: Browse by security topics (web security, malware, cloud security, etc.)
- 👤 **Author Filtering**: Discover posts from specific security researchers
- 📅 **Date Sorting**: View the newest or oldest posts
- 📱 **Responsive Design**: Works seamlessly on all devices

## 🛠️ Local Development

Want to run the site locally? Here's how:

### Prerequisites

- Ruby (version 2.7 or higher)
- Bundler gem (`gem install bundler`)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LouisMastelinck/securityblogsearch.com.git
   cd securityblogsearch.com
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Run Jekyll locally:**
   ```bash
   bundle exec jekyll serve
   ```

4. **Open your browser** to `http://localhost:4000`

The site will auto-reload when you make changes to files.

## 🤝 How to Contribute

**We welcome two types of contributions:**

### 1. Submit a Security Blog Post (Most Common)

This is the primary way to contribute! Help the community discover great security content by submitting links to blog posts.

**Quick Steps:**
1. **Fork** this repository
2. **Create** a new file in the `_posts/` directory named `YYYY-MM-DD-title-slug.md`
3. **Add** the required front matter (see format below)
4. **Submit** a pull request

**Post Format:**
```yaml
---
layout: post
title: "Your Post Title"
author: "Author Name"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
link: "https://link-to-original-article.com"
summary: "A brief 1-2 sentence summary of what the blog post covers."
---
```

**Example:**
```yaml
---
layout: post
title: "Advanced XSS Prevention Techniques"
author: "Jane Security"
date: 2024-10-27
tags: [web-security, xss, prevention]
link: "https://example.com/xss-prevention"
summary: "An in-depth guide to preventing cross-site scripting attacks using Content Security Policy, input sanitization, and modern framework protections."
---
```

**Guidelines:**
- Posts must be related to information security/cybersecurity
- Link must be publicly accessible
- Use descriptive, specific tags (e.g., "penetration-testing", "cloud-security")
- Write clear, informative summaries
- You can submit your own posts or posts you've found useful

📖 **Detailed instructions**: See [contributing.md](contributing.md) for complete guidelines and examples.

### 2. Improve the Website (Code Contributions)

Help improve the platform itself by contributing code, fixing bugs, or suggesting features.

- Report bugs via [GitHub Issues](https://github.com/LouisMastelinck/securityblogsearch.com/issues)
- Suggest new features
- Submit pull requests for improvements
- Improve documentation

## 🚀 Deployment

This site is automatically deployed via GitHub Actions:

- **Automatic**: Pushes to `main` branch trigger automatic deployment to GitHub Pages
- **Manual**: Can be triggered from the Actions tab
- **Live Site**: Available at [securityblogsearch.com](https://securityblogsearch.com)

### Deployment Process

1. GitHub Actions workflow (`.github/workflows/jekyll.yml`) runs
2. Jekyll builds the static site
3. Site is deployed to GitHub Pages
4. Changes are live within minutes

### GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. The site will be available at `https://securityblogsearch.com` (or your custom domain)

## 📚 Technology Stack

- **[Jekyll](https://jekyllrb.com/)** - Static site generator
- **HTML/CSS/JavaScript** - Frontend
- **[GitHub Pages](https://pages.github.com/)** - Free hosting
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline

## 📁 Repository Structure

```
.
├── _posts/              # Blog post submissions (main content)
├── _layouts/            # HTML templates
├── _includes/           # Reusable HTML components
├── assets/              # CSS, JS, images
├── _config.yml          # Jekyll configuration
├── index.html           # Homepage with search functionality
├── about.md             # About page
├── contributing.md      # Detailed contribution guide
└── README.md            # This file
```

## ❓ FAQ

**Q: Can I submit my own blog posts?**  
A: Yes! If you write security content, we'd love to have it in our directory.

**Q: What if the blog post is behind a paywall?**  
A: We prefer publicly accessible content so everyone in the community can benefit.

**Q: How long does it take for my submission to appear?**  
A: Once your pull request is reviewed and merged (usually within a few days), it appears immediately.

**Q: Can I submit posts in languages other than English?**  
A: Currently, we focus on English content, but we're open to expanding.

**Q: What makes a good summary?**  
A: A good summary is 1-3 sentences that clearly explain what the reader will learn, written in plain language.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/LouisMastelinck/securityblogsearch.com/issues)
- **Discussions**: [GitHub Discussions](https://github.com/LouisMastelinck/securityblogsearch.com/discussions)
- **Website**: [securityblogsearch.com](https://securityblogsearch.com)

---

**⭐ If you find this resource useful, please star the repository and share it with others in the security community!**