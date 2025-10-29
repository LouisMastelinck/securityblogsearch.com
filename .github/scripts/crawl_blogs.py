#!/usr/bin/env python3
"""
Website Crawler for Security Blog Search

This script crawls configured websites for new blog posts and creates
markdown files in the _posts directory with proper formatting.
"""

import os
import sys
import yaml
import feedparser
import requests
from datetime import datetime
from pathlib import Path
import re
import json
from urllib.parse import urljoin
from bs4 import BeautifulSoup


class BlogCrawler:
    """Crawls websites for new blog posts."""
    
    def __init__(self, config_path='websites.yml', posts_dir='_posts'):
        """Initialize the crawler."""
        self.config_path = config_path
        self.posts_dir = Path(posts_dir)
        self.websites = []
        self.existing_links = set()
        self.new_posts = []
        
    def load_config(self):
        """Load website configuration from YAML file."""
        try:
            with open(self.config_path, 'r') as f:
                config = yaml.safe_load(f)
                self.websites = config.get('websites', [])
                print(f"Loaded {len(self.websites)} websites to crawl")
        except Exception as e:
            print(f"Error loading config: {e}")
            sys.exit(1)
    
    def load_existing_posts(self):
        """Load existing post links to avoid duplicates."""
        if not self.posts_dir.exists():
            self.posts_dir.mkdir(parents=True, exist_ok=True)
            return
        
        for post_file in self.posts_dir.glob('*.md'):
            try:
                with open(post_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Extract link from front matter
                    match = re.search(r'^link:\s*["\']?([^"\'\n]+)["\']?', content, re.MULTILINE)
                    if match:
                        self.existing_links.add(match.group(1).strip())
            except Exception as e:
                print(f"Warning: Could not read {post_file}: {e}")
        
        print(f"Found {len(self.existing_links)} existing posts")
    
    def find_feed_url(self, base_url):
        """Try to auto-detect RSS/Atom feed URL from a website."""
        common_feed_paths = [
            '/feed/',
            '/rss/',
            '/atom.xml',
            '/feed.xml',
            '/rss.xml',
            '/blog/feed/',
            '/blog/rss/',
        ]
        
        # First, try to find feed link in HTML
        try:
            response = requests.get(base_url, timeout=10, headers={
                'User-Agent': 'SecurityBlogSearch-Crawler/1.0'
            })
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for RSS/Atom link tags
                for link in soup.find_all('link', type=['application/rss+xml', 'application/atom+xml']):
                    feed_url = link.get('href')
                    if feed_url:
                        return urljoin(base_url, feed_url)
        except Exception as e:
            print(f"Could not parse HTML for feed link: {e}")
        
        # Try common feed paths
        for path in common_feed_paths:
            feed_url = urljoin(base_url, path)
            try:
                response = requests.head(feed_url, timeout=5, headers={
                    'User-Agent': 'SecurityBlogSearch-Crawler/1.0'
                })
                if response.status_code == 200:
                    return feed_url
            except:
                continue
        
        return None
    
    def crawl_rss_feed(self, feed_url):
        """Crawl an RSS/Atom feed for blog posts."""
        try:
            print(f"Fetching feed: {feed_url}")
            feed = feedparser.parse(feed_url)
            
            if feed.bozo and feed.bozo_exception:
                print(f"Warning: Feed parse error: {feed.bozo_exception}")
            
            posts = []
            for entry in feed.entries:
                # Extract post data
                link = entry.get('link', '')
                title = entry.get('title', 'Untitled')
                
                # Get published date
                published = entry.get('published_parsed') or entry.get('updated_parsed')
                if published:
                    date = datetime(*published[:6])
                else:
                    date = datetime.now()
                
                # Get summary/description
                summary = entry.get('summary', '') or entry.get('description', '')
                # Clean HTML tags from summary
                if summary:
                    summary = re.sub(r'<[^>]+>', '', summary)
                    summary = ' '.join(summary.split())  # Normalize whitespace
                    # Limit summary length
                    if len(summary) > 200:
                        summary = summary[:197] + '...'
                
                if not summary:
                    summary = f"Blog post from {entry.get('author', 'the author')}"
                
                posts.append({
                    'link': link,
                    'title': title,
                    'date': date,
                    'summary': summary
                })
            
            return posts
        except Exception as e:
            print(f"Error crawling RSS feed {feed_url}: {e}")
            return []
    
    def create_slug(self, title):
        """Create a URL-friendly slug from title."""
        slug = title.lower()
        # Remove special characters
        slug = re.sub(r'[^\w\s-]', '', slug)
        # Replace spaces and multiple hyphens with single hyphen
        slug = re.sub(r'[-\s]+', '-', slug)
        # Remove leading/trailing hyphens
        slug = slug.strip('-')
        return slug[:80]  # Limit length
    
    def create_post_file(self, post_data, website_config):
        """Create a markdown file for a new post following _posts format."""
        date_str = post_data['date'].strftime('%Y-%m-%d')
        slug = self.create_slug(post_data['title'])
        filename = f"{date_str}-{slug}.md"
        filepath = self.posts_dir / filename
        
        # Avoid duplicate filenames
        counter = 1
        while filepath.exists():
            filename = f"{date_str}-{slug}-{counter}.md"
            filepath = self.posts_dir / filename
            counter += 1
        
        # Get tags - ensure it's a list
        tags = website_config.get('tags', [])
        if isinstance(tags, str):
            tags = [tags]
        
        # Format tags as a simple list (matching existing format)
        tags_str = '[' + ', '.join(tags) + ']'
        
        # Escape quotes in title and summary
        title = post_data['title'].replace('"', '\\"')
        summary = post_data['summary'].replace('"', '\\"')
        
        # Create front matter following the exact format from _posts
        front_matter = f"""---
layout: post
title: "{title}"
author: "{website_config.get('author', 'Unknown')}"
date: {date_str}
tags: {tags_str}
link: "{post_data['link']}"
summary: "{summary}"
---
"""
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(front_matter)
            print(f"Created: {filename}")
            return filename
        except Exception as e:
            print(f"Error creating file {filename}: {e}")
            return None
    
    def crawl_website(self, website_config):
        """Crawl a single website for new posts."""
        url = website_config.get('url')
        print(f"\n{'='*60}")
        print(f"Crawling: {url}")
        print(f"{'='*60}")
        
        # Get or find feed URL
        feed_url = website_config.get('rss_feed')
        if not feed_url:
            print("No RSS feed specified, attempting auto-detection...")
            feed_url = self.find_feed_url(url)
            if not feed_url:
                print(f"Could not find RSS feed for {url}")
                return
        
        print(f"Using feed: {feed_url}")
        
        # Crawl the feed
        posts = self.crawl_rss_feed(feed_url)
        print(f"Found {len(posts)} posts in feed")
        
        # Filter new posts
        new_posts = [p for p in posts if p['link'] not in self.existing_links]
        print(f"Identified {len(new_posts)} new posts")
        
        # Create files for new posts
        for post in new_posts:
            filename = self.create_post_file(post, website_config)
            if filename:
                self.new_posts.append(filename)
                self.existing_links.add(post['link'])
    
    def run(self):
        """Run the crawler."""
        print("Starting blog crawler...")
        print(f"Working directory: {os.getcwd()}")
        
        self.load_config()
        self.load_existing_posts()
        
        for website in self.websites:
            try:
                self.crawl_website(website)
            except Exception as e:
                print(f"Error crawling {website.get('url')}: {e}")
                continue
        
        print(f"\n{'='*60}")
        print(f"Crawling complete!")
        print(f"Total new posts created: {len(self.new_posts)}")
        print(f"{'='*60}")
        
        if self.new_posts:
            print("\nNew posts:")
            for post in self.new_posts:
                print(f"  - {post}")
        
        return len(self.new_posts)


def main():
    """Main entry point."""
    crawler = BlogCrawler()
    new_count = crawler.run()
    
    # Exit with code 0 if new posts were found (for GitHub Actions)
    sys.exit(0 if new_count > 0 else 1)


if __name__ == '__main__':
    main()
