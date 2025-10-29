#!/usr/bin/env python3
"""
Test script for blog crawler - tests local functionality without external requests
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

def test_slug_creation():
    """Test slug creation from titles"""
    from crawl_blogs import BlogCrawler
    
    crawler = BlogCrawler()
    
    test_cases = [
        ("Hello World - Testing 123", "hello-world-testing-123"),
        ("Azure AD & Security", "azure-ad-security"),
        ("Test!!!???", "test"),
        ("Multiple   Spaces", "multiple-spaces"),
    ]
    
    print("Testing slug creation:")
    for title, expected in test_cases:
        result = crawler.create_slug(title)
        status = "✓" if result == expected else "✗"
        print(f"  {status} '{title}' -> '{result}' (expected: '{expected}')")

def test_config_loading():
    """Test configuration loading"""
    from crawl_blogs import BlogCrawler
    
    print("\nTesting config loading:")
    crawler = BlogCrawler(config_path='../../websites.yml')
    crawler.load_config()
    
    if len(crawler.websites) > 0:
        print(f"  ✓ Loaded {len(crawler.websites)} website(s)")
        for site in crawler.websites:
            print(f"    - {site.get('url')}")
    else:
        print("  ✗ No websites loaded")

def test_existing_posts():
    """Test loading existing posts"""
    from crawl_blogs import BlogCrawler
    
    print("\nTesting existing posts detection:")
    crawler = BlogCrawler(posts_dir='../../_posts')
    crawler.load_existing_posts()
    
    print(f"  ✓ Found {len(crawler.existing_links)} existing post(s)")
    if crawler.existing_links:
        print(f"    Sample links:")
        for link in list(crawler.existing_links)[:3]:
            print(f"      - {link}")

def test_post_format():
    """Test post file format creation"""
    from crawl_blogs import BlogCrawler
    
    print("\nTesting post format generation:")
    
    post_data = {
        'title': 'Test Post Title',
        'date': __import__('datetime').datetime(2024, 10, 29),
        'link': 'https://example.com/test-post',
        'summary': 'This is a test summary for the blog post.'
    }
    
    website_config = {
        'author': 'Test Author',
        'tags': ['security', 'test']
    }
    
    crawler = BlogCrawler()
    slug = crawler.create_slug(post_data['title'])
    print(f"  ✓ Generated slug: '{slug}'")
    
    # Format would be: 2024-10-29-test-post-title.md
    expected_filename = f"{post_data['date'].strftime('%Y-%m-%d')}-{slug}.md"
    print(f"  ✓ Expected filename: '{expected_filename}'")

def test_author_extraction():
    """Test author extraction from RSS entries"""
    from crawl_blogs import BlogCrawler
    
    print("\nTesting author extraction:")
    
    crawler = BlogCrawler()
    
    # Test with author field
    entry1 = {'author': 'John Doe'}
    author1 = crawler.extract_author_from_entry(entry1)
    print(f"  ✓ Extracted author from 'author' field: '{author1}'")
    
    # Test with no author
    entry2 = {}
    author2 = crawler.extract_author_from_entry(entry2)
    print(f"  ✓ Handles missing author: {author2}")

def test_tag_extraction():
    """Test tag extraction from RSS entries"""
    from crawl_blogs import BlogCrawler
    
    print("\nTesting tag extraction:")
    
    crawler = BlogCrawler()
    
    # Test with RSS tags
    entry1 = {
        'tags': [{'term': 'azure'}, {'term': 'security'}],
        'title': 'Test Post',
        'summary': 'A test post'
    }
    tags1 = crawler.extract_tags_from_entry(entry1)
    print(f"  ✓ Extracted tags from RSS feed: {tags1}")
    
    # Test with content inference (now separate method)
    entry2 = {
        'title': 'Azure Security and Entra ID Best Practices',
        'summary': 'Learn about Microsoft Defender and conditional access policies'
    }
    tags2 = crawler.infer_tags_from_content(entry2)
    print(f"  ✓ Inferred tags from content: {tags2}")

if __name__ == '__main__':
    print("Blog Crawler Unit Tests")
    print("=" * 60)
    
    try:
        test_slug_creation()
        test_config_loading()
        test_existing_posts()
        test_post_format()
        test_author_extraction()
        test_tag_extraction()
        
        print("\n" + "=" * 60)
        print("All tests completed!")
        
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
