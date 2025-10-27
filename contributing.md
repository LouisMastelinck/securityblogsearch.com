---
layout: default
title: Contributing to Security Blog Search
---

<div class="container">
    <div class="post">
        <h1>Contributing to Security Blog Search</h1>
        
        <p>Thank you for your interest in contributing to Security Blog Search! This platform is community-driven, and we welcome blog post submissions from security researchers, bloggers, and enthusiasts.</p>
        
        <h2>How to Submit a Blog Post</h2>
        
        <p>There are two ways to submit a security blog post:</p>
        
        <h3>Option 1: Use the Submit Form (Recommended)</h3>
        
        <p>The easiest way to submit a post is to use our <a href="{{ '/submit' | relative_url }}">Submit Post form</a>. This form will:</p>
        
        <ul>
            <li>Help you fill in all required fields</li>
            <li>Let you select from existing tags or create new ones</li>
            <li>Automatically generate the properly formatted markdown file</li>
            <li>Provide clear instructions for submitting via pull request</li>
        </ul>
        
        <p><a href="{{ '/submit' | relative_url }}" class="external-link">Go to Submit Form →</a></p>
        
        <h3>Option 2: Manual Submission</h3>
        
        <p>If you prefer, you can manually create the post file:</p>
        
        <ol>
            <li><strong>Fork the repository</strong> on GitHub: <a href="https://github.com/LouisMastelinck/securityblogsearch.com">securityblogsearch.com</a></li>
            <li><strong>Create a new file</strong> in the <code>_posts</code> directory</li>
            <li><strong>Name your file</strong> using the format: <code>YYYY-MM-DD-title-slug.md</code> (e.g., <code>2024-10-27-my-security-post.md</code>)</li>
            <li><strong>Add the required front matter</strong> at the top of your file</li>
            <li><strong>Submit a pull request</strong> with your new post</li>
        </ol>
        
        <h2>Required Post Format</h2>
        
        <p>Each blog post submission must include the following front matter:</p>
        
        <pre><code>---
layout: post
title: "Your Post Title"
author: "Your Name"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
link: "https://link-to-original-article.com"
summary: "A brief summary of the blog post (1-2 sentences describing the content)"
---

Optional: Additional content or notes about the post.
</code></pre>
        
        <h2>Field Descriptions</h2>
        
        <ul>
            <li><strong>title</strong>: The title of the blog post (required)</li>
            <li><strong>author</strong>: The name of the blog post author (required)</li>
            <li><strong>date</strong>: Publication date in YYYY-MM-DD format (required)</li>
            <li><strong>tags</strong>: Array of relevant tags/topics (required, minimum 1 tag)</li>
            <li><strong>link</strong>: URL to the original blog post (required)</li>
            <li><strong>summary</strong>: Brief summary of the post content (required, 1-3 sentences)</li>
        </ul>
        
        <h2>Content Guidelines</h2>
        
        <ul>
            <li>Posts should be related to information security, cybersecurity, or related topics</li>
            <li>Original blog post must be publicly accessible</li>
            <li>Summary should be informative and concise</li>
            <li>Use relevant and specific tags (e.g., "web-security", "malware", "incident-response")</li>
            <li>Ensure all information is accurate</li>
        </ul>
        
        <h2>Example Submission</h2>
        
        <p>Here's an example of a properly formatted submission:</p>
        
        <pre><code>---
layout: post
title: "Advanced XSS Prevention Techniques"
author: "Alex Security"
date: 2024-10-27
tags: [web-security, xss, prevention]
link: "https://example.com/xss-prevention"
summary: "This article explores advanced techniques for preventing cross-site scripting (XSS) attacks in modern web applications, including Content Security Policy and sanitization best practices."
---
</code></pre>
        
        <h2>Review Process</h2>
        
        <p>Once you submit a pull request:</p>
        
        <ol>
            <li>Repository maintainers will review your submission</li>
            <li>We'll check that all required fields are present and properly formatted</li>
            <li>We'll verify the link is accessible and content is relevant</li>
            <li>If approved, your post will be merged and appear on the site</li>
        </ol>
        
        <h2>Questions?</h2>
        
        <p>If you have questions about contributing, please open an issue on <a href="https://github.com/LouisMastelinck/securityblogsearch.com/issues">GitHub</a>.</p>
    </div>
</div>
