---
layout: default
title: Contributing to Security Blog Search
---

<div class="container">
    <div class="post">
        <h1>Contributing to Security Blog Search</h1>
        
        <p>Thank you for your interest in contributing to Security Blog Search! This platform is community-driven, and we welcome blog post submissions from security researchers, bloggers, and enthusiasts.</p>
        
        <div class="alert alert-info">
            <strong>⚠️ Important for External Contributors:</strong> For security reasons, external contributors can <strong>only</strong> modify files in the <code>_posts/</code> directory. Pull requests that attempt to modify configuration files, layouts, workflows, or any other files outside the posts folder will be automatically rejected. See <a href="https://github.com/LouisMastelinck/securityblogsearch.com/blob/main/.github/RULESETS.md">Repository Rulesets Documentation</a> for more details.
        </div>
        
        <h2>How to Submit a Blog Post</h2>
        
        <p>To submit a security blog post, please follow these steps:</p>
        
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
title: "Advanced Threat Protection with Microsoft Defender for Endpoint"
author: "Sarah Mitchell"
date: 2024-10-27
tags: [defender, microsoft-defender-xdr, endpoint-security, threat-hunting]
link: "https://example.com/defender-endpoint-threat-protection"
summary: "This article explores advanced threat protection capabilities in Microsoft Defender for Endpoint, including automated investigation and response, threat hunting with KQL, and integration with Microsoft Sentinel for enhanced security operations."
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
