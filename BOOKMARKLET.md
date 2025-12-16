# LinkedIn Post Capture Bookmarklet

This bookmarklet helps you quickly capture LinkedIn post information for submission to Security Blog Search.

## Installation

### Option 1: Drag and Drop (Most Browsers)

1. Show your bookmarks bar (usually Ctrl+Shift+B or Cmd+Shift+B)
2. Drag the link below to your bookmarks bar:

**[Capture LinkedIn Post](#)** ← Drag this to your bookmarks bar

### Option 2: Manual Installation

1. Create a new bookmark in your browser
2. Name it: "Capture LinkedIn Post"
3. For the URL, paste the following code:

```javascript
javascript:(function(){const t=document.title.replace(' | LinkedIn','').trim();const u=window.location.href;const a=document.querySelector('[data-test-id="main-feed-activity-card__actor-text"] span span:first-child, .update-components-actor__name span:first-child, [data-urn] .feed-shared-actor__name span:first-child');const author=a?a.textContent.trim():'Unknown';const d=new Date().toISOString().split('T')[0];const s=document.querySelector('.feed-shared-text__text-view span, .break-words span, article .feed-shared-update-v2__description span');const summary=s?s.textContent.trim().substring(0,200):'';const form=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LinkedIn Post Capture</title><style>body{font-family:sans-serif;max-width:700px;margin:30px auto;padding:20px;background:#f5f5f5}h2{color:#0077B5}label{display:block;margin-top:15px;font-weight:600}input,textarea{width:100%;padding:8px;margin-top:5px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box}textarea{min-height:80px}pre{background:#2d2d2d;color:#f8f8f2;padding:15px;border-radius:4px;overflow-x:auto}.btn{background:#0077B5;color:white;padding:10px 20px;border:none;border-radius:4px;cursor:pointer;margin-top:10px}.btn:hover{background:#005885}.success{background:#28a745}.success:hover{background:#218838}</style></head><body><h2>Captured LinkedIn Post</h2><form id="f"><label>Title:</label><input id="title" value="${t.replace(/"/g,'&quot;')}"><label>Author:</label><input id="author" value="${author.replace(/"/g,'&quot;')}"><label>Date:</label><input type="date" id="date" value="${d}"><label>URL:</label><input id="url" value="${u.replace(/"/g,'&quot;')}"><label>Tags (comma-separated):</label><input id="tags" placeholder="e.g., entra-id, security"><label>Summary:</label><textarea id="summary">${summary.replace(/"/g,'&quot;')}</textarea><button type="button" class="btn" onclick="generate()">Generate Markdown</button></form><div id="out" style="display:none;margin-top:20px"><h3>Markdown File Content:</h3><pre id="md"></pre><button class="btn success" onclick="copy()">Copy to Clipboard</button><p style="margin-top:10px;color:#666"><small>Save this as: <strong id="fn"></strong></small></p></div><script>function generate(){const title=document.getElementById('title').value;const author=document.getElementById('author').value;const date=document.getElementById('date').value;const url=document.getElementById('url').value;const tags=document.getElementById('tags').value.split(',').map(t=>t.trim()).filter(t=>t);const summary=document.getElementById('summary').value;const slug=title.toLowerCase().replace(/[^a-z0-9\\s-]/g,'').replace(/\\s+/g,'-').substring(0,60);const fn=date+'-'+slug+'.md';const md='---\\nlayout: post\\ntitle: "'+title+'"\\nauthor: "'+author+'"\\ndate: '+date+'\\ntags: ['+tags.join(', ')+']\\nlink: "'+url+'"\\nsummary: "'+summary+'"\\n---';document.getElementById('md').textContent=md;document.getElementById('fn').textContent=fn;document.getElementById('out').style.display='block'}function copy(){const md=document.getElementById('md').textContent;navigator.clipboard.writeText(md).then(()=>alert('Copied to clipboard!'))}<\/script></body></html>`;const w=window.open('','_blank','width=800,height=700');w.document.write(form);w.document.close()})();
```

## Usage

1. Navigate to a LinkedIn post you want to capture
2. Click the bookmarklet in your bookmarks bar
3. A new window will open with pre-filled information
4. Review and edit the captured information:
   - **Title**: Automatically captured from page title
   - **Author**: Automatically extracted from the post
   - **Date**: Set to today (adjust if needed)
   - **URL**: Automatically captured
   - **Tags**: Add relevant tags (comma-separated)
   - **Summary**: Automatically captured first portion (edit as needed)
5. Click "Generate Markdown"
6. Click "Copy to Clipboard"
7. Create a new file in `_linkedin_posts` with the suggested filename
8. Paste the content and submit a pull request

## Bookmarklet Features

- ✅ Automatically captures post title
- ✅ Extracts author name from LinkedIn post
- ✅ Sets current date
- ✅ Captures post URL
- ✅ Attempts to extract post summary
- ✅ Generates properly formatted markdown
- ✅ Suggests appropriate filename
- ✅ One-click copy to clipboard

## Troubleshooting

**The bookmarklet doesn't work on my LinkedIn post:**
- Make sure you're on the actual LinkedIn post page
- Some posts may have different HTML structures; you can manually fill in the fields
- Try refreshing the page and clicking the bookmarklet again

**Author name shows as "Unknown":**
- LinkedIn's HTML structure varies; you can manually type the author name in the form

**Summary is empty or incomplete:**
- Long posts may not be fully captured; manually copy the summary from the LinkedIn post

## Browser Compatibility

This bookmarklet works on:
- ✅ Chrome/Chromium browsers
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ⚠️ Mobile browsers (limited support)

## Privacy Note

This bookmarklet runs entirely in your browser. No data is sent to any external server. It simply captures visible information from the LinkedIn page you're viewing.

## Alternative: Web Form

If the bookmarklet doesn't work for you, use the web form available at:
`linkedin-helper.html`

This form allows manual entry of all LinkedIn post information.
