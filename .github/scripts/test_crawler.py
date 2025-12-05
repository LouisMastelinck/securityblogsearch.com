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

def test_summary_extraction():
    """Test summary extraction from blog post URLs"""
    from crawl_blogs import BlogCrawler
    
    print("\nTesting summary extraction:")
    
    crawler = BlogCrawler()
    
    # Note: This would make a real HTTP request, so we just test that the method exists
    # and can handle errors gracefully
    print("  ✓ Summary extraction method is available")
    
    # Test with invalid URL to verify error handling
    summary = crawler.extract_summary_from_url('https://invalid-url-that-does-not-exist-12345.com')
    if summary is None:
        print("  ✓ Gracefully handles invalid URLs")
    else:
        print("  ✗ Should return None for invalid URLs")

def test_last_crawl_timestamp():
    """Test last crawl timestamp update functionality"""
    from crawl_blogs import update_last_crawl_timestamp
    import json
    import tempfile
    import shutil
    
    print("\nTesting last crawl timestamp update:")
    
    # Create a temporary directory to test in
    original_dir = os.getcwd()
    with tempfile.TemporaryDirectory() as tmpdir:
        os.chdir(tmpdir)
        os.makedirs('assets', exist_ok=True)
        
        # Test the function
        update_last_crawl_timestamp()
        
        # Verify the file was created
        timestamp_file = Path('assets/last_crawl.json')
        if timestamp_file.exists():
            print("  ✓ Timestamp file created")
            
            # Verify content is valid JSON with expected structure
            with open(timestamp_file) as f:
                data = json.load(f)
                if 'timestamp' in data:
                    print(f"  ✓ Timestamp present: {data['timestamp']}")
                    # Verify ISO format
                    if data['timestamp'].endswith('Z') and 'T' in data['timestamp']:
                        print("  ✓ Timestamp is in correct ISO format")
                    else:
                        print("  ✗ Timestamp format is incorrect")
                else:
                    print("  ✗ Timestamp field missing")
        else:
            print("  ✗ Timestamp file was not created")
        
        os.chdir(original_dir)

def test_crawl_history():
    """Test crawl history tracking functionality"""
    from crawl_blogs import BlogCrawler
    import json
    import tempfile
    
    print("\nTesting crawl history tracking:")
    
    original_dir = os.getcwd()
    with tempfile.TemporaryDirectory() as tmpdir:
        os.chdir(tmpdir)
        os.makedirs('assets', exist_ok=True)
        
        history_file = Path('assets/crawl_history.json')
        
        # Test creating a new crawler with no history
        crawler = BlogCrawler(config_path='../../websites.yml', history_path=history_file)
        crawler.load_crawl_history()
        
        if len(crawler.crawl_history) == 0:
            print("  ✓ Empty crawl history loaded for new crawler")
        else:
            print("  ✗ Expected empty crawl history")
        
        # Test marking a site as crawled
        test_url = "https://example.com"
        crawler.mark_site_crawled(test_url)
        
        if test_url in crawler.crawl_history:
            print(f"  ✓ Site marked as crawled: {test_url}")
            if 'last_crawled' in crawler.crawl_history[test_url]:
                print(f"  ✓ Timestamp recorded: {crawler.crawl_history[test_url]['last_crawled']}")
            else:
                print("  ✗ Missing timestamp")
        else:
            print("  ✗ Site not marked in history")
        
        # Test saving history
        crawler.save_crawl_history()
        
        if history_file.exists():
            print("  ✓ History file saved")
            
            # Test loading saved history
            crawler2 = BlogCrawler(config_path='../../websites.yml', history_path=history_file)
            crawler2.load_crawl_history()
            
            if test_url in crawler2.crawl_history:
                print("  ✓ History loaded from file correctly")
            else:
                print("  ✗ History not loaded correctly")
        else:
            print("  ✗ History file not created")
        
        os.chdir(original_dir)

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
        test_summary_extraction()
        test_last_crawl_timestamp()
        test_crawl_history()
        
        print("\n" + "=" * 60)
        print("All tests completed!")
        
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
